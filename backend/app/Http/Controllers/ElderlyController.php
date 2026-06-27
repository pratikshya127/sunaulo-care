<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreElderlyRequest;
use App\Http\Resources\ElderlyProfileResource;
use App\Models\ElderlyProfile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ElderlyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $elderly = ElderlyProfile::with('user')
            ->where('caregiver_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json(['data' => ElderlyProfileResource::collection($elderly)]);
    }

    public function store(StoreElderlyRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Create the elderly user account
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => bcrypt($data['password']),
            'role'     => 'elderly',
        ]);

        $profile = ElderlyProfile::create([
            'user_id'             => $user->id,
            'age'                 => $data['age']                 ?? null,
            'gender'              => $data['gender']              ?? null,
            'blood_group'         => $data['blood_group']         ?? null,
            'medical_conditions'  => $data['medical_conditions']  ?? null,
            'caregiver_id'        => $request->user()->id,
        ]);

        return response()->json(['data' => new ElderlyProfileResource($profile->load('user'))], 201);
    }

    public function show(int $id): JsonResponse
    {
        $profile = ElderlyProfile::with(['user', 'caregiver', 'healthRecords' => fn ($q) => $q->latest()->limit(10), 'medicines'])
            ->findOrFail($id);

        return response()->json(['data' => new ElderlyProfileResource($profile)]);
    }

    public function update(StoreElderlyRequest $request, int $id): JsonResponse
    {
        $profile = ElderlyProfile::where('caregiver_id', $request->user()->id)->findOrFail($id);

        $profile->update($request->safe()->only(['age', 'gender', 'blood_group', 'medical_conditions']));

        return response()->json(['data' => new ElderlyProfileResource($profile->fresh('user'))]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $profile = ElderlyProfile::where('caregiver_id', $request->user()->id)->findOrFail($id);
        $profile->delete();

        return response()->json(['message' => 'Elderly profile deleted.']);
    }
}
