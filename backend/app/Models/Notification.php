<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = ['receiver_id', 'title', 'message', 'type', 'read'];

    protected $casts = ['read' => 'boolean'];

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
