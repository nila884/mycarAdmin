<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {

        if (Auth::check() && $request->user()->hasRole('admin')) {
            return $next($request);
        }

        // 2. If it's an API/AJAX request, return JSON 403
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Access Denied: You do not have administrative privileges.'
            ], 403);
        }

        // 3. If it's a web request (Inertia/Blade), redirect to home with an error
        return redirect('/login')->with('error', 'Unauthorized access.');
    }
}