<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHealthRecordRequest;
use App\Http\Resources\HealthRecordResource;
use App\Models\ElderlyProfile;
use App\Models\FamilyConnection;
use App\Models\HealthRecord;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HealthRecordController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user      = $request->user();
        $elderlyId = $request->query('elderly_id');

        $query = HealthRecord::with('recorder')->latest();

        if ($user->isCaregiver()) {
            $elderlyIds = ElderlyProfile::where('caregiver_id', $user->id)->pluck('id');
            $query->whereIn('elderly_id', $elderlyIds);
        } elseif ($user->isFamily()) {
            $elderlyIds = FamilyConnection::where('family_user_id', $user->id)->pluck('elderly_id');
            $query->whereIn('elderly_id', $elderlyIds);
        } elseif ($user->isElderly()) {
            $profile = $user->elderlyProfile;
            $query->where('elderly_id', $profile?->id);
        }

        if ($elderlyId) {
            $query->where('elderly_id', $elderlyId);
        }

        return response()->json(['data' => HealthRecordResource::collection($query->paginate(20))]);
    }

    public function store(StoreHealthRecordRequest $request): JsonResponse
    {
        $data             = $request->validated();
        $data['recorded_by'] = $request->user()->id;

        $record = HealthRecord::create($data);

        // Notify family members
        $elderly = ElderlyProfile::with('familyConnections.familyMember')->find($data['elderly_id']);
        if ($elderly) {
            foreach ($elderly->familyConnections as $conn) {
                Notification::create([
                    'receiver_id' => $conn->family_user_id,
                    'title'       => 'Health Update',
                    'message'     => "New health record added for {$elderly->user->name}.",
                    'type'        => 'health_record',
                    'read'        => false,
                ]);
            }
        }

        return response()->json(['data' => new HealthRecordResource($record->load('recorder'))], 201);
    }

    public function show(int $id): JsonResponse
    {
        $record = HealthRecord::with('recorder')->findOrFail($id);

        return response()->json(['data' => new HealthRecordResource($record)]);
    }

    public function update(StoreHealthRecordRequest $request, int $id): JsonResponse
    {
        $record = HealthRecord::findOrFail($id);
        $record->update($request->validated());

        return response()->json(['data' => new HealthRecordResource($record->fresh('recorder'))]);
    }

    public function destroy(int $id): JsonResponse
    {
        HealthRecord::findOrFail($id)->delete();

        return response()->json(['message' => 'Record deleted.']);
    }

    public function report(Request $request): JsonResponse
    {
        $user      = $request->user();
        $elderlyId = $request->query('elderly_id');
        $from      = $request->query('from', now()->subDays(30)->toDateString());
        $to        = $request->query('to', now()->toDateString());

        $query = HealthRecord::whereBetween('created_at', [$from, $to . ' 23:59:59']);

        if ($elderlyId) {
            $query->where('elderly_id', $elderlyId);
        } elseif ($user->isFamily()) {
            $ids = FamilyConnection::where('family_user_id', $user->id)->pluck('elderly_id');
            $query->whereIn('elderly_id', $ids);
        }

        $records = $query->oldest()->get();

        return response()->json([
            'data' => HealthRecordResource::collection($records),
            'meta' => ['from' => $from, 'to' => $to, 'total' => $records->count()],
        ]);
    }
}
