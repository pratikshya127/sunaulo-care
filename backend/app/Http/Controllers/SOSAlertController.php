<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSOSAlertRequest;
use App\Http\Resources\SOSAlertResource;
use App\Models\ElderlyProfile;
use App\Models\FamilyConnection;
use App\Models\Notification;
use App\Models\SOSAlert;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SOSAlertController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user  = $request->user();
        $query = SOSAlert::with('elderly.user')->latest();

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

        return response()->json(['data' => SOSAlertResource::collection($query->paginate(20))]);
    }

    public function store(StoreSOSAlertRequest $request): JsonResponse
    {
        $user    = $request->user();
        $profile = $user->elderlyProfile;

        if (!$profile) {
            return response()->json(['message' => 'Only elderly users can trigger SOS.'], 403);
        }

        $alert = SOSAlert::create([
            'elderly_id' => $profile->id,
            'latitude'   => $request->input('latitude'),
            'longitude'  => $request->input('longitude'),
            'message'    => $request->input('message', 'Emergency SOS alert!'),
            'status'     => 'active',
        ]);

        // Load relations for notifications
        $profile->loadMissing(['caregiver', 'familyConnections']);

        $elderlyName = $user->name;
        $title       = '🚨 SOS Alert';
        $message     = "{$elderlyName} has triggered an emergency SOS alert!";

        if ($profile->caregiver) {
            Notification::create([
                'receiver_id' => $profile->caregiver->id,
                'title'       => $title,
                'message'     => $message,
                'type'        => 'sos',
                'read'        => false,
            ]);
        }

        foreach ($profile->familyConnections as $conn) {
            Notification::create([
                'receiver_id' => $conn->family_user_id,
                'title'       => $title,
                'message'     => $message,
                'type'        => 'sos',
                'read'        => false,
            ]);
        }

        return response()->json(['data' => new SOSAlertResource($alert->load('elderly.user'))], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $alert = SOSAlert::findOrFail($id);
        $alert->update(['status' => $request->input('status', 'resolved')]);

        return response()->json(['data' => new SOSAlertResource($alert)]);
    }
}
