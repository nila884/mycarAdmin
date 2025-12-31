<?php
namespace App\Http\Controllers;

use App\Classes\Services\ClientAuthService;
use App\Http\Controllers\Controller;
use App\Http\Resources\ClientResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

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

    /**
     * Handle Logout
     */
    public function logout(Request $request)
    {
        
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Logged out successfully'
    ]);
    }
}