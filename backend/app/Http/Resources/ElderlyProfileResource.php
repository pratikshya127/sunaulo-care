<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ElderlyProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'user'               => new UserResource($this->whenLoaded('user')),
            'age'                => $this->age,
            'gender'             => $this->gender,
            'blood_group'        => $this->blood_group,
            'medical_conditions' => $this->medical_conditions,
            'caregiver'          => new UserResource($this->whenLoaded('caregiver')),
            'created_at'         => $this->created_at?->toDateTimeString(),
        ];
    }
}
