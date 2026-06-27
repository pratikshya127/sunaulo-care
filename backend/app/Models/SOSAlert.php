<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SOSAlert extends Model
{
    use HasFactory;

    protected $table = 'sos_alerts';

    protected $fillable = ['elderly_id', 'latitude', 'longitude', 'message', 'status'];

    public function elderly()
    {
        return $this->belongsTo(ElderlyProfile::class, 'elderly_id');
    }
}
