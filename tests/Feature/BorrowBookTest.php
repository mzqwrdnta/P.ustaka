<?php

use App\Models\Book;
use App\Models\Member;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user can borrow a book', function () {
    $member = Member::factory()->create();

    $book = Book::factory()->create([
        'stok' => 5,
        'status' => 'aktif',
    ]);

    $response = $this->actingAs($member->user)->post("/user/books/{$book->id}/borrow");

    $response->assertRedirect(route('user.transactions.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('transactions', [
        'member_id' => $member->id,
        'book_id' => $book->id,
        'status' => 'pending_peminjaman',
    ]);
});

test('user cannot borrow same book twice', function () {
    $member = Member::factory()->create();

    $book = Book::factory()->create([
        'stok' => 5,
        'status' => 'aktif',
    ]);

    Transaction::create([
        'kode_transaksi' => 'TRX-TEST-001',
        'member_id' => $member->id,
        'book_id' => $book->id,
        'status' => 'pending_peminjaman',
        'status_denda' => 'belum_ada',
        'denda' => 0,
    ]);

    $response = $this->actingAs($member->user)->post("/user/books/{$book->id}/borrow");

    $response->assertRedirect();
    $response->assertSessionHas('error', 'Anda sudah meminjam atau sedang mengajukan buku ini.');
    $response->assertSessionHas('error_book_id', $book->id);

    // Should NOT create a second transaction
    expect(Transaction::where('book_id', $book->id)->count())->toBe(1);
});

test('user cannot borrow an out of stock book', function () {
    $member = Member::factory()->create();

    $book = Book::factory()->create([
        'stok' => 0,
        'status' => 'aktif',
    ]);

    $response = $this->actingAs($member->user)->post("/user/books/{$book->id}/borrow");

    $response->assertRedirect();
    $response->assertSessionHas('error', 'Buku tidak tersedia untuk dipinjam.');

    $this->assertDatabaseMissing('transactions', [
        'member_id' => $member->id,
        'book_id' => $book->id,
    ]);
});

test('flash data includes error_book_id when borrow is rejected for duplicate', function () {
    $member = Member::factory()->create();

    $book = Book::factory()->create([
        'stok' => 5,
        'status' => 'aktif',
    ]);

    Transaction::create([
        'kode_transaksi' => 'TRX-TEST-002',
        'member_id' => $member->id,
        'book_id' => $book->id,
        'status' => 'dipinjam',
        'status_denda' => 'belum_ada',
        'denda' => 0,
    ]);

    $response = $this->actingAs($member->user)->post("/user/books/{$book->id}/borrow");

    $response->assertSessionHas('error_book_id', $book->id);
    $response->assertSessionHas('error');
});
