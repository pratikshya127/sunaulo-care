<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MedicineLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'medicine'    => new MedicineResource($this->whenLoaded('medicine')),
            'elderly_id'  => $this->elderly_id,
            'taken'       => $this->taken,
            'taken_time'  => $this->taken_time?->toDateTimeString(),
            'remarks'     => $this->remarks,
            'logged_at'   => $this->created_at?->toDateTimeString(),
        ];
    }
}
