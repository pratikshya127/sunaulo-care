<?php

namespace App\Http\Controllers;

use App\Models\ElderlyProfile;
use App\Models\FamilyConnection;
use App\Models\HealthRecord;
use App\Models\Medicine;
use App\Models\MedicineLog;
use App\Models\Notification;
use App\Models\SOSAlert;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        return match ($user->role) {
            'elderly'   => $this->elderlyDashboard($user),
            'caregiver' => $this->caregiverDashboard($user),
            'family'    => $this->familyDashboard($user),
            default     => response()->json(['message' => 'Unknown role.'], 400),
        };
    }

    private function elderlyDashboard($user): JsonResponse
    {
        $profile = $user->elderlyProfile;

        if (!$profile) {
            return response()->json(['role' => 'elderly', 'profile_incomplete' => true]);
        }

        $todayMeds  = Medicine::where('elderly_id', $profile->id)->where('active', true)->get();
        $todayLogs  = MedicineLog::where('elderly_id', $profile->id)->whereDate('created_at', today())->get();
        $latestRec  = HealthRecord::where('elderly_id', $profile->id)->latest()->first();
        $activeSOS  = SOSAlert::where('elderly_id', $profile->id)->where('status', 'active')->count();
        $unread     = Notification::where('receiver_id', $user->id)->where('read', false)->count();

        return response()->json([
            'role'            => 'elderly',
            'medicines_today' => $todayMeds->count(),
            'taken_today'     => $todayLogs->where('taken', true)->count(),
            'latest_vitals'   => $latestRec,
            'active_sos'      => $activeSOS,
            'unread_notifications' => $unread,
        ]);
    }

    private function caregiverDashboard($user): JsonResponse
    {
        $elderlyIds = ElderlyProfile::where('caregiver_id', $user->id)->pluck('id');

        $totalElderly    = $elderlyIds->count();
        $activeSOS       = SOSAlert::whereIn('elderly_id', $elderlyIds)->where('status', 'active')->count();
        $todayLogs       = MedicineLog::whereIn('elderly_id', $elderlyIds)->whereDate('created_at', today());
        $complianceToday = $todayLogs->count() > 0
            ? round(($todayLogs->where('taken', true)->count() / $todayLogs->count()) * 100, 1)
            : 0;
        $recentRecords   = HealthRecord::whereIn('elderly_id', $elderlyIds)->latest()->limit(5)->get();
        $unread          = Notification::where('receiver_id', $user->id)->where('read', false)->count();

        return response()->json([
            'role'            => 'caregiver',
            'total_elderly'   => $totalElderly,
            'active_sos'      => $activeSOS,
            'compliance_today'=> $complianceToday,
            'recent_records'  => $recentRecords,
            'unread_notifications' => $unread,
        ]);
    }

    private function familyDashboard($user): JsonResponse
    {
        $elderlyIds = FamilyConnection::where('family_user_id', $user->id)->pluck('elderly_id');

        $activeSOS    = SOSAlert::whereIn('elderly_id', $elderlyIds)->where('status', 'active')->count();
        $latestRecord = HealthRecord::whereIn('elderly_id', $elderlyIds)->latest()->first();
        $todayLogs    = MedicineLog::whereIn('elderly_id', $elderlyIds)->whereDate('created_at', today());
        $compliance   = $todayLogs->count() > 0
            ? round(($todayLogs->where('taken', true)->count() / $todayLogs->count()) * 100, 1)
            : 0;
        $unread       = Notification::where('receiver_id', $user->id)->where('read', false)->count();

        return response()->json([
            'role'              => 'family',
            'monitored_elderly' => $elderlyIds->count(),
            'active_sos'        => $activeSOS,
            'latest_vitals'     => $latestRecord,
            'compliance_today'  => $compliance,
            'unread_notifications' => $unread,
        ]);
    }
}
