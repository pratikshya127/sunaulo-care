<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMedicineRequest;
use App\Http\Resources\MedicineResource;
use App\Models\ElderlyProfile;
use App\Models\FamilyConnection;
use App\Models\Medicine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user      = $request->user();
        $elderlyId = $request->query('elderly_id');

        $query = Medicine::with('elderly.user')->where('active', true)->latest();

        if ($user->isCaregiver()) {
            $ids = ElderlyProfile::where('caregiver_id', $user->id)->pluck('id');
            $query->whereIn('elderly_id', $ids);
        } elseif ($user->isFamily()) {
            $ids = FamilyConnection::where('family_user_id', $user->id)->pluck('elderly_id');
            $query->whereIn('elderly_id', $ids);
        } elseif ($user->isElderly()) {
            $profile = $user->elderlyProfile;
            $query->where('elderly_id', $profile?->id);
        }

        if ($elderlyId) {
            $query->where('elderly_id', $elderlyId);
        }

        return response()->json(['data' => MedicineResource::collection($query->get())]);
    }

    public function today(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user->isElderly()) {
            return response()->json(['data' => []]);
        }

        $profile   = $user->elderlyProfile;
        $medicines = Medicine::where('elderly_id', $profile?->id)->where('active', true)->get();

        return response()->json(['data' => MedicineResource::collection($medicines)]);
    }

    public function store(StoreMedicineRequest $request): JsonResponse
    {
        $medicine = Medicine::create($request->validated());

        return response()->json(['data' => new MedicineResource($medicine->load('elderly.user'))], 201);
    }

    public function show(int $id): JsonResponse
    {
        $medicine = Medicine::with('elderly.user')->findOrFail($id);

        return response()->json(['data' => new MedicineResource($medicine)]);
    }

    public function update(StoreMedicineRequest $request, int $id): JsonResponse
    {
        $medicine = Medicine::findOrFail($id);
        $medicine->update($request->validated());

        return response()->json(['data' => new MedicineResource($medicine->fresh('elderly.user'))]);
    }

    public function destroy(int $id): JsonResponse
    {
        $medicine = Medicine::findOrFail($id);
        $medicine->update(['active' => false]);

        return response()->json(['message' => 'Medicine deactivated.']);
    }
}
