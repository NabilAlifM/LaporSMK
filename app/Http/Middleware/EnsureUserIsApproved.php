<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsApproved
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->status !== 'approved') {
            return redirect()->route('profile.edit')->with('warning', 'Akun Anda sedang dalam peninjauan oleh Admin. Anda belum dapat menggunakan fitur Komin sebelum akun divalidasi.');
        }

        return $next($request);
    }
}
