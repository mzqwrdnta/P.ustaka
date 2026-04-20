<?php

use App\Models\Setting;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    Setting::updateOrCreate(['key' => 'denda_per_hari'], ['value' => '2000']);
    Setting::updateOrCreate(['key' => 'maksimal_hari_pinjam'], ['value' => '7']);
});

test('it calculates fine correctly for 1 day late', function () {
    $transaction = Transaction::factory()->create([
        'status' => 'pending_pengembalian',
        'tanggal_jatuh_tempo' => now()->subDay()->format('Y-m-d'),
    ]);

    $this->actingAs($this->admin)
        ->post("/admin/transactions/{$transaction->id}/verify-return")
        ->assertRedirect();

    $transaction->refresh();
    expect($transaction->status)->toBe('dikembalikan');
    expect($transaction->hari_terlambat)->toBe(1);
    expect((int) $transaction->denda)->toBe(2000);
    expect($transaction->status_denda)->toBe('belum_bayar');
});

test('it calculates fine correctly for 7 days late', function () {
    $transaction = Transaction::factory()->create([
        'status' => 'pending_pengembalian',
        'tanggal_jatuh_tempo' => now()->subDays(7)->format('Y-m-d'),
    ]);

    $this->actingAs($this->admin)
        ->post("/admin/transactions/{$transaction->id}/verify-return")
        ->assertRedirect();

    $transaction->refresh();
    expect($transaction->status)->toBe('dikembalikan');
    expect($transaction->hari_terlambat)->toBe(7);
    expect((int) $transaction->denda)->toBe(14000);
});

test('admin can pay fine in full', function () {
    $transaction = Transaction::factory()->create([
        'denda' => 10000,
        'denda_dibayar' => 0,
        'status_denda' => 'belum_bayar',
    ]);

    $this->actingAs($this->admin)
        ->post("/admin/fines/{$transaction->id}", [
            'status_denda' => 'lunas',
        ])
        ->assertRedirect();

    $transaction->refresh();
    expect($transaction->status_denda)->toBe('lunas');
    expect((int) $transaction->denda_dibayar)->toBe(10000);
});

test('admin can pay fine partially', function () {
    $transaction = Transaction::factory()->create([
        'denda' => 10000,
        'denda_dibayar' => 0,
        'status_denda' => 'belum_bayar',
    ]);

    // Pay 5000
    $this->actingAs($this->admin)
        ->post("/admin/fines/{$transaction->id}", [
            'bayar' => 5000,
        ])
        ->assertRedirect();

    $transaction->refresh();
    expect($transaction->status_denda)->toBe('belum_bayar');
    expect((int) $transaction->denda_dibayar)->toBe(5000);

    // Pay another 5000 (should become lunas)
    $this->actingAs($this->admin)
        ->post("/admin/fines/{$transaction->id}", [
            'bayar' => 5000,
        ])
        ->assertRedirect();

    $transaction->refresh();
    expect($transaction->status_denda)->toBe('lunas');
    expect((int) $transaction->denda_dibayar)->toBe(10000);
});
