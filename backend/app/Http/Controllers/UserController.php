<?php

namespace App\Http\Controllers;

use App\Models\ElderlyProfile;
use App\Models\FamilyConnection;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function searchElderly(Request $request): JsonResponse
    {
        $q = trim($request->query('q', ''));

        if (strlen($q) < 2) {
            return response()->json(['data' => []]);
        }

        $users = User::where('role', 'elderly')
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                      ->orWhere('email', 'like', "%{$q}%");
            })
            ->limit(10)
            ->get(['id', 'name', 'email']);

        return response()->json(['data' => $users]);
    }

    public function saveMyProfile(Request $request): JsonResponse
    {
        $data = $request->validate([
            'age'                => 'nullable|integer|min:1|max:120',
            'gender'             => 'nullable|in:male,female,other',
            'blood_group'        => 'nullable|string|max:5',
            'medical_conditions' => 'nullable|array',
            'medical_conditions.*' => 'string|max:100',
        ]);

        $profile = ElderlyProfile::updateOrCreate(
            ['user_id' => $request->user()->id],
            $data
        );

        return response()->json(['data' => $profile], 201);
    }

    public function connectToElderly(Request $request): JsonResponse
    {
        $request->validate(['elderly_user_id' => 'required|integer|exists:users,id']);

        $elderlyUser = User::where('id', $request->elderly_user_id)
                           ->where('role', 'elderly')
                           ->first();

        if (!$elderlyUser) {
            return response()->json(['message' => 'No elderly person found with that information.'], 404);
        }

        $profile = ElderlyProfile::where('user_id', $elderlyUser->id)->first();

        if (!$profile) {
            return response()->json([
                'message' => 'This person has not completed their profile setup yet.',
            ], 422);
        }

        $role = $request->user()->role;

        if ($role === 'family') {
            FamilyConnection::firstOrCreate([
                'family_user_id' => $request->user()->id,
                'elderly_id'     => $profile->id,
            ]);
        } elseif ($role === 'caregiver') {
            $profile->update(['caregiver_id' => $request->user()->id]);
        }

        return response()->json([
            'message' => 'Connected successfully.',
            'data'    => $profile->load('user'),
        ]);
    }
}
