<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HealthRecordResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                        => $this->id,
            'elderly_id'                => $this->elderly_id,
            'blood_pressure_systolic'   => $this->blood_pressure_systolic,
            'blood_pressure_diastolic'  => $this->blood_pressure_diastolic,
            'blood_pressure'            => $this->blood_pressure_systolic && $this->blood_pressure_diastolic
                ? "{$this->blood_pressure_systolic}/{$this->blood_pressure_diastolic}"
                : null,
            'sugar_level'               => $this->sugar_level,
            'weight'                    => $this->weight,
            'temperature'               => $this->temperature,
            'oxygen_level'              => $this->oxygen_level,
            'pulse_rate'                => $this->pulse_rate,
            'water_intake'              => $this->water_intake,
            'sleep_hours'               => $this->sleep_hours,
            'notes'                     => $this->notes,
            'recorder'                  => new UserResource($this->whenLoaded('recorder')),
            'recorded_at'               => $this->created_at?->toDateTimeString(),
        ];
    }
}
