<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'elderly_id', 'blood_pressure_systolic', 'blood_pressure_diastolic',
        'sugar_level', 'weight', 'temperature', 'oxygen_level',
        'pulse_rate', 'water_intake', 'sleep_hours', 'notes', 'recorded_by',
    ];

    protected $casts = ['created_at' => 'datetime', 'updated_at' => 'datetime'];

    public function elderly()
    {
        return $this->belongsTo(ElderlyProfile::class, 'elderly_id');
    }

    public function recorder()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
