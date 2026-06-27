<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVoiceMessageRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'audio'       => ['required', 'file', 'mimes:mp3,wav,ogg,webm,m4a', 'max:20480'],
            'receiver_id' => ['required', 'exists:users,id'],
            'duration'    => ['nullable', 'integer', 'min:0'],
        ];
    }
}
