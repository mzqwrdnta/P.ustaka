<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\SendOtpMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class ResetPasswordOtpController extends Controller
{
    public function sendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $user = User::where('email', $request->email)->first();

        // Limit OTP request every 10 seconds - based on 5 min expiry, 4m 50s left means 10s passed
        if ($user->otp_expires_at && $user->otp_expires_at->subSeconds(290)->isFuture()) {
            $diff = $user->otp_expires_at->subSeconds(290)->diffInSeconds(now());

            return back()->withErrors(['email' => "Silakan tunggu {$diff} detik sebelum meminta kode OTP kembali."]);
        }

        $user->generateOtp();
        Mail::to($user->email)->send(new SendOtpMail($user->otp, 'reset_password'));

        return back()->with('status', 'Kode OTP telah dikirim ke email Anda.');
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->otp !== $request->otp || ! $user->otp_expires_at || ! $user->otp_expires_at->isFuture()) {
            return back()->withErrors(['otp' => 'Kode OTP salah atau sudah kedaluwarsa.']);
        }

        $user->password = Hash::make($request->password);
        $user->otp = null;
        $user->otp_expires_at = null;
        $user->save();

        return redirect()->route('login')->with('status', 'Password berhasil diubah. Silakan login.');
    }
}
