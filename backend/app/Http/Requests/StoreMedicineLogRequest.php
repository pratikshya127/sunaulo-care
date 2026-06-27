<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMedicineLogRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'medicine_id' => ['required', 'exists:medicines,id'],
            'taken'       => ['required', 'boolean'],
            'taken_time'  => ['nullable', 'date'],
            'remarks'     => ['nullable', 'string', 'max:500'],
        ];
    }
}
