<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHealthRecordRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'elderly_id'               => ['required', 'exists:elderly_profiles,id'],
            'blood_pressure_systolic'   => ['nullable', 'numeric', 'min:0', 'max:300'],
            'blood_pressure_diastolic'  => ['nullable', 'numeric', 'min:0', 'max:200'],
            'sugar_level'               => ['nullable', 'numeric', 'min:0'],
            'weight'                    => ['nullable', 'numeric', 'min:0'],
            'temperature'               => ['nullable', 'numeric', 'min:30', 'max:45'],
            'oxygen_level'              => ['nullable', 'numeric', 'min:0', 'max:100'],
            'pulse_rate'                => ['nullable', 'integer', 'min:0', 'max:300'],
            'water_intake'              => ['nullable', 'numeric', 'min:0'],
            'sleep_hours'               => ['nullable', 'numeric', 'min:0', 'max:24'],
            'notes'                     => ['nullable', 'string', 'max:2000'],
        ];
    }
}
