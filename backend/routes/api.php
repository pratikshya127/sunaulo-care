<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ElderlyController;
use App\Http\Controllers\HealthRecordController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\MedicineLogController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SOSAlertController;
use App\Http\Controllers\VoiceMessageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;

// ─── Public Auth ──────────────────────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ─── Authenticated Routes ─────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user',    [AuthController::class, 'user']);

    // Dashboard summary
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // User search & connections
    Route::get('/users/search', [UserController::class, 'searchElderly']);
    Route::post('/my-profile', [UserController::class, 'saveMyProfile'])->middleware('role:elderly');
    Route::post('/connect-elderly', [UserController::class, 'connectToElderly'])->middleware('role:caregiver,family');

    // Elderly (caregiver only)
    Route::middleware('role:caregiver')->group(function () {
        Route::apiResource('elderly', ElderlyController::class);
    });

    // Health Records
    Route::get('/health-records',       [HealthRecordController::class, 'index']);
    Route::post('/health-records',      [HealthRecordController::class, 'store'])->middleware('role:caregiver');
    Route::get('/health-records/{id}',  [HealthRecordController::class, 'show']);
    Route::put('/health-records/{id}',  [HealthRecordController::class, 'update'])->middleware('role:caregiver');
    Route::delete('/health-records/{id}', [HealthRecordController::class, 'destroy'])->middleware('role:caregiver');

    // Medicines
    Route::get('/medicines',         [MedicineController::class, 'index']);
    Route::post('/medicines',        [MedicineController::class, 'store'])->middleware('role:caregiver');
    Route::get('/medicines/{id}',    [MedicineController::class, 'show']);
    Route::put('/medicines/{id}',    [MedicineController::class, 'update'])->middleware('role:caregiver');
    Route::delete('/medicines/{id}', [MedicineController::class, 'destroy'])->middleware('role:caregiver');
    Route::get('/medicines/today',   [MedicineController::class, 'today']);

    // Medicine Logs (elderly takes/skips)
    Route::get('/medicine-logs',    [MedicineLogController::class, 'index']);
    Route::post('/medicine-logs',   [MedicineLogController::class, 'store']);

    // Notifications
    Route::get('/notifications',               [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read',    [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all',     [NotificationController::class, 'markAllRead']);
    Route::delete('/notifications/{id}',       [NotificationController::class, 'destroy']);

    // SOS Alerts
    Route::get('/sos-alerts',         [SOSAlertController::class, 'index']);
    Route::post('/sos-alerts',        [SOSAlertController::class, 'store']);
    Route::put('/sos-alerts/{id}',    [SOSAlertController::class, 'update']);

    // Voice Messages
    Route::get('/voice-messages',         [VoiceMessageController::class, 'index']);
    Route::post('/voice-messages',        [VoiceMessageController::class, 'store']);
    Route::delete('/voice-messages/{id}', [VoiceMessageController::class, 'destroy']);
    Route::get('/voice-messages/{id}/download', [VoiceMessageController::class, 'download']);

    // Reports (caregiver & family)
    Route::middleware('role:caregiver,family')->group(function () {
        Route::get('/reports/health',    [HealthRecordController::class, 'report']);
        Route::get('/reports/medicines', [MedicineLogController::class, 'report']);
    });
});
