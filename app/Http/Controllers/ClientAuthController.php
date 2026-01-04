<?php
namespace App\Http\Controllers;

use App\Classes\Services\ClientAuthService;
use App\Http\Controllers\Controller;
use App\Http\Resources\ClientResource;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ClientAuthController extends Controller
{
    protected $authService;

    public function __construct(ClientAuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(Request $request)
    {
       
        try {
            $user = $this->authService->registerClient($request->all());

            $token = $user->createToken('client_token')->plainTextToken;
            return (new ClientResource($user))->additional([
                'token' => $token,
                'roles' => $user->getRoleNames(),
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            dd($e);
            return response()->json([
                'message' => 'An error occurred during registration.'
            ], 500);
        }
    }

    /**
     * Handle Client Login
     */
    public function login(Request $request)
    {
       
        try {
            // 1. Delegate credentials check to Service
            $user = $this->authService->loginClient($request->all());

            // 2. Create Token
            $token = $user->createToken('client_token')->plainTextToken;

            // 3. Return Resource with Token
            return (new ClientResource($user))->additional([
                'token' => $token
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Invalid credentials.',
                'errors' => $e->errors()
            ], 422);
        }
    }


    public function logout(Request $request)
    {
        
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Logged out successfully'
    ]);
    }

    public function show(Request $request)
{
    return response()->json($this->authService->show($request));
}

public function updateField(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'sometimes|string|max:255',
            'email'   => 'sometimes|email|unique:users,email,' . $request->user()->id,
            'country' => 'sometimes|string', 
            'address' => 'sometimes|string',
            'phone'   => 'sometimes|string',
        ]);

        $user = $this->authService->updateSingleField($request->user(), $validated);

        return new ClientResource($user);
    }

    public function updatePassword(Request $request)
    {
$request->validate([
        'current_password' => ['required', 'current_password'],
        'password' => ['required', 'confirmed', Password::defaults()],
    ]);

    $user = $request->user();

    // 1. Update the password in the users table
    $user->update([
        'password' => Hash::make($request->password),
    ]);

    // 2. Revoke all existing tokens (Security step)
    $user->tokens()->delete();

    // 3. Create a new "fresh" token
    $newToken = $user->createToken('auth_token')->plainTextToken;

    // 4. Return via ClientResource which handles the token field
    $user->token = $newToken; 
    return new ClientResource($user->load('client'));
    }

}