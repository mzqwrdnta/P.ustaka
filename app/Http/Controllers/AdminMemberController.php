<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminMemberController extends Controller
{
    public function index(Request $request)
    {
        $query = Member::with('user');

        // SEARCH NIS / NAMA
        if ($request->filled('search')) {
            $search = trim($request->search);

            $query->where(function ($q) use ($search) {
                $q->where('nis', 'like', "%{$search}%")
                    ->orWhere('nama_lengkap', 'like', "%{$search}%");
            });
        }

        // FILTER KELAS
        if ($request->kelas !== null && $request->kelas !== '') {
            $query->whereRaw("REPLACE(LOWER(kelas), '-', ' ') = ?", [strtolower($request->kelas)]);
        }

        // FILTER JENIS KELAMIN
        if ($request->jenis_kelamin !== null && $request->jenis_kelamin !== '') {
            $query->where('jenis_kelamin', $request->jenis_kelamin);
        }

        // FILTER STATUS AKTIF
        if ($request->status_aktif !== null && $request->status_aktif !== '') {
            $query->where('status_aktif', (int) $request->status_aktif);
        }

        $members = $query
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Members/Index', [
            'members' => $members,
            'filters' => $request->only(['search', 'kelas', 'jenis_kelamin', 'status_aktif']),
            'kelasOptions' => Member::getUniqueKelas(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Members/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'nis' => 'required|unique:members,nis',
            'nama_lengkap' => 'required|string|max:255',
            'kelas' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'no_hp' => 'required|string|max:20',
            'alamat' => 'nullable|string',
            'status_aktif' => 'boolean',
        ]);

        $user = User::create([
            'name' => $validated['nama_lengkap'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => 'user',
        ]);

        Member::create([
            'user_id' => $user->id,
            'nis' => $validated['nis'],
            'nama_lengkap' => $validated['nama_lengkap'],
            'kelas' => $validated['kelas'],
            'jenis_kelamin' => $validated['jenis_kelamin'],
            'no_hp' => $validated['no_hp'],
            'alamat' => $validated['alamat'],
            'status_aktif' => $validated['status_aktif'] ?? true,
        ]);

        return redirect()->route('admin.members.index')->with('success', 'Anggota berhasil ditambahkan.');
    }

    public function edit(Member $member)
    {
        $member->load('user');

        return Inertia::render('Admin/Members/Edit', [
            'member' => $member,
        ]);
    }

    public function update(Request $request, Member $member)
    {
        $validated = $request->validate([
            'nis' => 'required|unique:members,nis,'.$member->id,
            'nama_lengkap' => 'required|string|max:255',
            'kelas' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'no_hp' => 'required|string|max:20',
            'alamat' => 'nullable|string',
            'status_aktif' => 'boolean',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('foto')) {
            if ($member->foto) {
                Storage::disk('public')->delete($member->foto);
            }
            $validated['foto'] = $request->file('foto')->store('members', 'public');
        } else {
            unset($validated['foto']);
        }

        $member->update($validated);

        if ($member->user) {
            $member->user->update([
                'name' => $validated['nama_lengkap'],
            ]);
        }

        return redirect()->route('admin.members.index')->with('success', 'Anggota berhasil diupdate.');
    }

    public function destroy(Member $member)
    {
        $member->user()->delete(); // Will cascade if setup properly or we delete user too.
        $member->delete();

        return redirect()->route('admin.members.index')->with('success', 'Anggota berhasil dihapus.');
    }
}
