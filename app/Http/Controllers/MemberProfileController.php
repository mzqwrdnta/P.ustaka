<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberProfileController extends Controller
{
    public function show()
    {
        $member = auth()->user()->member;

        return Inertia::render('User/Profile', [
            'member' => $member,
            'user' => auth()->user(),
        ]);
    }

    public function create()
    {
        if (auth()->user()->member) {
            return redirect()->route('user.dashboard');
        }

        return Inertia::render('User/CompleteProfile');
    }

    public function store(Request $request)
    {
        if (auth()->user()->member) {
            return redirect()->route('user.dashboard');
        }

        $validated = $request->validate([
            'nis' => 'required|string|max:50|unique:members,nis',
            'nama_lengkap' => 'required|string|max:255',
            'kelas' => 'required|string|max:50',
            'jenis_kelamin' => 'required|string|in:Laki-laki,Perempuan',
            'no_hp' => 'required|string|max:20',
            'alamat' => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['status_aktif'] = true;

        Member::create($validated);

        // Update user name in users table to match the completed profile
        auth()->user()->update(['name' => $validated['nama_lengkap']]);

        return redirect()->route('user.dashboard');
    }
}
