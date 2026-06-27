<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicineLog extends Model
{
    use HasFactory;

    protected $fillable = ['medicine_id', 'elderly_id', 'taken', 'taken_time', 'remarks'];

    protected $casts = ['taken' => 'boolean', 'taken_time' => 'datetime'];

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }

    public function elderly()
    {
        return $this->belongsTo(ElderlyProfile::class, 'elderly_id');
    }
}
