<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FamilyConnection extends Model
{
    use HasFactory;

    protected $fillable = ['family_user_id', 'elderly_id'];

    public function familyMember()
    {
        return $this->belongsTo(User::class, 'family_user_id');
    }

    public function elderly()
    {
        return $this->belongsTo(ElderlyProfile::class, 'elderly_id');
    }
}
