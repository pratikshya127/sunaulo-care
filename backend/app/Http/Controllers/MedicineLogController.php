<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMedicineLogRequest;
use App\Http\Resources\MedicineLogResource;
use App\Models\ElderlyProfile;
use App\Models\FamilyConnection;
use App\Models\Medicine;
use App\Models\MedicineLog;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicineLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user      = $request->user();
        $elderlyId = $request->query('elderly_id');
        $date      = $request->query('date', today()->toDateString());

        $query = MedicineLog::with('medicine')->whereDate('created_at', $date)->latest();

        if ($user->isElderly()) {
            $profile = $user->elderlyProfile;
            $query->where('elderly_id', $profile?->id);
        } elseif ($user->isCaregiver()) {
            $ids = ElderlyProfile::where('caregiver_id', $user->id)->pluck('id');
            $query->whereIn('elderly_id', $ids);
        } elseif ($user->isFamily()) {
            $ids = FamilyConnection::where('family_user_id', $user->id)->pluck('elderly_id');
            $query->whereIn('elderly_id', $ids);
        }

        if ($elderlyId) {
            $query->where('elderly_id', $elderlyId);
        }

        return response()->json(['data' => MedicineLogResource::collection($query->get())]);
    }

    public function store(StoreMedicineLogRequest $request): JsonResponse
    {
        $data    = $request->validated();
        $user    = $request->user();
        $profile = $user->elderlyProfile;

        if (!$profile) {
            return response()->json(['message' => 'Elderly profile not found.'], 404);
        }

        $data['elderly_id'] = $profile->id;
        $log                = MedicineLog::create($data);

        $medicine = Medicine::with('elderly.caregiver', 'elderly.familyConnections.familyMember')
            ->find($data['medicine_id']);

        if ($medicine) {
            $elderlyName = $profile->user->name;
            $medName     = $medicine->medicine_name;
            $action      = $data['taken'] ? 'taken' : 'skipped';
            $title       = $data['taken'] ? 'Medicine Taken ✓' : 'Medicine Skipped ⚠';
            $message     = "{$elderlyName} has {$action} {$medName}.";

            // Notify caregiver
            if ($medicine->elderly?->caregiver) {
                Notification::create([
                    'receiver_id' => $medicine->elderly->caregiver->id,
                    'title'       => $title,
                    'message'     => $message,
                    'type'        => 'medicine_' . $action,
                    'read'        => false,
                ]);
            }

            // Notify family
            foreach ($medicine->elderly->familyConnections ?? [] as $conn) {
                Notification::create([
                    'receiver_id' => $conn->family_user_id,
                    'title'       => $title,
                    'message'     => $message,
                    'type'        => 'medicine_' . $action,
                    'read'        => false,
                ]);
            }
        }

        return response()->json(['data' => new MedicineLogResource($log->load('medicine'))], 201);
    }

    public function report(Request $request): JsonResponse
    {
        $elderlyId = $request->query('elderly_id');
        $from      = $request->query('from', now()->subDays(30)->toDateString());
        $to        = $request->query('to', now()->toDateString());

        $logs = MedicineLog::with('medicine')
            ->where('elderly_id', $elderlyId)
            ->whereBetween('created_at', [$from, $to . ' 23:59:59'])
            ->get();

        $total  = $logs->count();
        $taken  = $logs->where('taken', true)->count();
        $rate   = $total > 0 ? round(($taken / $total) * 100, 1) : 0;

        return response()->json([
            'data' => MedicineLogResource::collection($logs),
            'meta' => [
                'total'            => $total,
                'taken'            => $taken,
                'skipped'          => $total - $taken,
                'compliance_rate'  => $rate,
            ],
        ]);
    }
}
