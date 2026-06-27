<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    use HasFactory;

    protected $fillable = [
        'elderly_id', 'medicine_name', 'dosage',
        'frequency', 'reminder_time', 'instructions', 'active',
    ];

    protected $casts = ['active' => 'boolean', 'reminder_time' => 'array'];

    public function elderly()
    {
        return $this->belongsTo(ElderlyProfile::class, 'elderly_id');
    }

    public function logs()
    {
        return $this->hasMany(MedicineLog::class);
    }
}
