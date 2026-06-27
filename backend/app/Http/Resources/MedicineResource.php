<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MedicineResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'elderly_id'    => $this->elderly_id,
            'elderly'       => new ElderlyProfileResource($this->whenLoaded('elderly')),
            'medicine_name' => $this->medicine_name,
            'dosage'        => $this->dosage,
            'frequency'     => $this->frequency,
            'reminder_time' => $this->reminder_time,
            'instructions'  => $this->instructions,
            'active'        => $this->active,
            'created_at'    => $this->created_at?->toDateTimeString(),
        ];
    }
}
