<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMedicineRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'elderly_id'    => ['required', 'exists:elderly_profiles,id'],
            'medicine_name' => ['required', 'string', 'max:255'],
            'dosage'        => ['required', 'string', 'max:100'],
            'frequency'     => ['required', 'string', 'max:100'],
            'reminder_time' => ['nullable', 'array'],
            'reminder_time.*' => ['string', 'regex:/^\d{2}:\d{2}$/'],
            'instructions'  => ['nullable', 'string', 'max:1000'],
            'active'        => ['boolean'],
        ];
    }
}
