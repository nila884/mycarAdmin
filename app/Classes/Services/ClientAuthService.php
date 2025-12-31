<?php
namespace App\Classes\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class ClientAuthService
{
    /**
     * Handle Registration Logic
     */
    public function registerClient(array $data)
    {
$validator = Validator::make($data, [
            'name' => [
                'required', 
                'string', 
                'max:255', 
                'regex:/^[a-zA-Z\s]+$/'
            ],
            'email' => [
                'required', 
                'string', 
                'email', 
                'max:255', 
                'unique:users'
            ],
            'phone' => [
                'required', 
                'regex:/^([0-9\s\-\+\(\)]*)$/', 
                'min:10'
            ],
            'password' => 'required|string|min:8',
            'country'  => 'required|exists:countries,id',
            'address'  => 'required|string',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name'     => $data['name'],
                'email'    => Str::lower($data['email']), 
                'password' => Hash::make($data['password']),
            ]);

            $user->client()->create([
                'country' => $data['country'],
                'address' => $data['address'],
                'phone'   => $data['phone'],
            ]);
                $user->assignRole('user');
            return $user;
        });
    }

    /**
     * Handle Login Logic
     */
    public function loginClient(array $data)
    {
        $user = User::where('email', Str::lower($data['email']))->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }

        return $user;
    }
}