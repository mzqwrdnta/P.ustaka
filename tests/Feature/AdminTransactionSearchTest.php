<?php

use App\Models\Book;
use App\Models\Member;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function createAdmin(): User
{
    return User::factory()->create(['role' => 'admin']);
}

test('borrows search filters by member name', function () {
    $admin = createAdmin();
    $member = Member::factory()->create(['nama_lengkap' => 'Budi Santoso']);
    Transaction::factory()->create(['member_id' => $member->id, 'status' => 'dipinjam']);
    Transaction::factory()->create(['status' => 'dipinjam']);

    $response = $this->actingAs($admin)->get('/admin/transactions/borrows?search=Budi');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Transactions/Borrows')
        ->has('transactions.data', 1)
    );
});

test('borrows search filters by book title', function () {
    $admin = createAdmin();
    $book = Book::factory()->create(['judul' => 'Laskar Pelangi']);
    Transaction::factory()->create(['book_id' => $book->id, 'status' => 'dipinjam']);
    Transaction::factory()->create(['status' => 'dipinjam']);

    $response = $this->actingAs($admin)->get('/admin/transactions/borrows?search=Laskar');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Transactions/Borrows')
        ->has('transactions.data', 1)
    );
});

test('returns search filters by member name', function () {
    $admin = createAdmin();
    $member = Member::factory()->create(['nama_lengkap' => 'Siti Aminah']);
    Transaction::factory()->create(['member_id' => $member->id, 'status' => 'dikembalikan']);
    Transaction::factory()->create(['status' => 'dikembalikan']);

    $response = $this->actingAs($admin)->get('/admin/transactions/returns?search=Siti');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Transactions/Returns')
        ->has('transactions.data', 1)
    );
});

test('returns search filters by book title', function () {
    $admin = createAdmin();
    $book = Book::factory()->create(['judul' => 'Bumi Manusia']);
    Transaction::factory()->create(['book_id' => $book->id, 'status' => 'dikembalikan']);
    Transaction::factory()->create(['status' => 'dikembalikan']);

    $response = $this->actingAs($admin)->get('/admin/transactions/returns?search=Bumi');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Transactions/Returns')
        ->has('transactions.data', 1)
    );
});

test('transaction show returns json detail', function () {
    $admin = createAdmin();
    $transaction = Transaction::factory()->create();

    $response = $this->actingAs($admin)->getJson('/admin/transactions/' . $transaction->id);

    $response->assertSuccessful();
    $response->assertJsonStructure([
        'id',
        'kode_transaksi',
        'member',
        'book',
        'status',
    ]);
});

test('members index loads with user relation', function () {
    $admin = createAdmin();
    Member::factory()->create();

    $response = $this->actingAs($admin)->get('/admin/members');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Members/Index')
        ->has('members.data', 1)
    );
});
