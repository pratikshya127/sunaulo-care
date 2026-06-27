<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role'];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
    ];

    // ── Relationships ──────────────────────────────────────────────────────────

    public function elderlyProfile()
    {
        return $this->hasOne(ElderlyProfile::class);
    }

    public function caregiverElderly()
    {
        return $this->hasMany(ElderlyProfile::class, 'caregiver_id');
    }

    public function familyConnections()
    {
        return $this->hasMany(FamilyConnection::class, 'family_user_id');
    }

    public function sentVoiceMessages()
    {
        return $this->hasMany(VoiceMessage::class, 'sender_id');
    }

    public function receivedVoiceMessages()
    {
        return $this->hasMany(VoiceMessage::class, 'receiver_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'receiver_id');
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    public function isElderly(): bool   { return $this->role === 'elderly'; }
    public function isCaregiver(): bool { return $this->role === 'caregiver'; }
    public function isFamily(): bool    { return $this->role === 'family'; }
}
