<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureHasMemberProfile
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        // If the user has a 'user' role but no member profile record, force them to complete it
        if ($user && $user->role === 'user' && ! $user->member) {
            if (! $request->routeIs('user.profile.complete') && ! $request->routeIs('user.profile.store')) {
                return redirect()->route('user.profile.complete');
            }
        }

        return $next($request);
    }
}
