<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberProfileController extends Controller
{
    public function index(Request $request)
{
    $query = Member::query();

    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('nis', 'like', "%{$search}%")
              ->orWhere('nama_lengkap', 'like', "%{$search}%");
        });
    }

    if ($request->filled('kelas')) {
        $query->where('kelas', $request->kelas);
    }

    if ($request->filled('jenis_kelamin')) {
        $query->where('jenis_kelamin', $request->jenis_kelamin);
    }

    if ($request->filled('status_aktif')) {
        $query->where('status_aktif', $request->status_aktif);
    }

    $members = $query
        ->latest()
        ->paginate(10)
        ->withQueryString();

    $kelasOptions = Member::select('kelas')
        ->distinct()
        ->orderBy('kelas')
        ->pluck('kelas');

    return Inertia::render('admin/members/index', [
        'members' => $members,
        'filters' => $request->only([
            'search',
            'kelas',
            'jenis_kelamin',
            'status_aktif',
        ]),
        'kelasOptions' => $kelasOptions,
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
