<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SOSAlertResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'elderly'    => new ElderlyProfileResource($this->whenLoaded('elderly')),
            'latitude'   => $this->latitude,
            'longitude'  => $this->longitude,
            'message'    => $this->message,
            'status'     => $this->status,
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
