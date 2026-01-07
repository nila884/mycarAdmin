<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});
test('new users can register', function () {
    // Define the dashboard route so the controller has somewhere to go
    Route::get('/dashboard', fn () => 'dashboard')->name('dashboard');

    $response = $this->post('/register', [
        'name' => 'nila',
        'email' => 'nila@mail.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'user_type' => 'simple_user',
    ]);

    // Just verify the DB and the Session
    $this->assertDatabaseHas('users', ['email' => 'nila@mail.com']);
    $this->assertAuthenticated();
    $response->assertRedirect('/dashboard');
});

test('registration fails if user_type is missing', function () {
    $response = $this->postJson('/register', [
        'name' => 'nila',
        'email' => 'nila@mail.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        // user_type is missing here
    ]);

    // Should return validation error
    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['user_type']);
});