<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ElderlyProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'age', 'gender', 'blood_group',
        'medical_conditions', 'caregiver_id',
    ];

    protected $casts = ['medical_conditions' => 'array'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function caregiver()
    {
        return $this->belongsTo(User::class, 'caregiver_id');
    }

    public function healthRecords()
    {
        return $this->hasMany(HealthRecord::class, 'elderly_id');
    }

    public function medicines()
    {
        return $this->hasMany(Medicine::class, 'elderly_id');
    }

    public function familyConnections()
    {
        return $this->hasMany(FamilyConnection::class, 'elderly_id');
    }

    public function sosAlerts()
    {
        return $this->hasMany(SOSAlert::class, 'elderly_id');
    }
}
