<?php
namespace App\Http\Controllers;

use App\Classes\Services\ClientAuthService;
use App\Http\Controllers\Controller;
use App\Http\Resources\ClientResource;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class ClientAuthController extends Controller
{
    protected $authService;

    public function __construct(ClientAuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(Request $request)
    {
       $registerKey = 'register|' . $request->ip();
    if (RateLimiter::tooManyAttempts($registerKey, 3)) {
        return response()->json(['message' => 'Too many accounts created. Try again later.'], 429);
    }
        try {
            $user = $this->authService->registerClient($request->all());
            RateLimiter::hit($registerKey, 3600);
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
         
            return response()->json([
                'message' => 'An error occurred during registration.'
            ], 500);
        }
    }

   public function login(Request $request)
{
    // 1. Create a unique key for this user (Email + IP)
    $throttleKey = Str::transliterate(Str::lower($request->input('email')).'|'.$request->ip());

    // 2. Check if they have reached the limit (e.g., 5 attempts)
    if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
        $seconds = RateLimiter::availableIn($throttleKey);
        return response()->json([
            'message' => "Too many login attempts. Please try again in {$seconds} seconds.",
        ], 429);
    }

    try {
        $user = $this->authService->loginClient($request->all());
        // 3. Role Check: Block Admins
        if (!$user->hasRole('user')) {
            // Count this as a "hit" even though password was right
            RateLimiter::hit($throttleKey); 
            
            return response()->json([
                'message' => 'Access Denied: Admin accounts cannot log in here.'
            ], 403);
        }

        // 4. Success: Clear the counter
        RateLimiter::clear($throttleKey);

        $token = $user->createToken('client_token')->plainTextToken;

        return (new ClientResource($user))->additional([
            'token' => $token
        ]);

    } catch (ValidationException $e) {
        // 5. Failure: Increment the counter
        RateLimiter::hit($throttleKey);

        return response()->json([
            'message' => 'Invalid credentials.',
            'errors' => $e->errors()
        ], 422);
    }
}


    public function logout(Request $request)
    {
        
    $token = $request->user()->currentAccessToken();
    if ($token instanceof \Laravel\Sanctum\PersonalAccessToken) {
        $token->delete();
    }

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
    
    $user->update([
        'password' => Hash::make($request->password),
    ]);

    // 1. Revoke all old tokens (Security Best Practice)
    $user->tokens()->delete();

    // 2. Create the new token
    $newToken = $user->createToken('auth_token')->plainTextToken;

    // 3. Attach the token property to the user object 
    // so that ClientResource's $this->token can see it!
    $user->token = $newToken; 

    // 4. Return the resource
    return new ClientResource($user->load('client'));
}

}