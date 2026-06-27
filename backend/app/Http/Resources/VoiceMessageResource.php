<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class VoiceMessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'sender'     => new UserResource($this->whenLoaded('sender')),
            'receiver'   => new UserResource($this->whenLoaded('receiver')),
            'audio_url'  => Storage::disk('public')->url($this->audio_file),
            'duration'   => $this->duration,
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
