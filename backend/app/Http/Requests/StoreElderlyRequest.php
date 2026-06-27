<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreElderlyRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'               => ['required_without:user_id', 'string', 'max:255'],
            'email'              => ['required_without:user_id', 'email', 'unique:users,email'],
            'password'           => ['required_without:user_id', 'string', 'min:8'],
            'age'                => ['nullable', 'integer', 'min:0', 'max:150'],
            'gender'             => ['nullable', 'in:male,female,other'],
            'blood_group'        => ['nullable', 'string', 'max:10'],
            'medical_conditions' => ['nullable', 'array'],
            'medical_conditions.*' => ['string'],
        ];
    }
}
