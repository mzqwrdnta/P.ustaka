<?php

namespace Database\Factories;

use App\Models\Book;
use App\Models\Member;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kode_transaksi' => 'TRX-'.fake()->unique()->numerify('#####'),
            'member_id' => Member::factory(),
            'book_id' => Book::factory(),
            'tanggal_pinjam' => now(),
            'tanggal_jatuh_tempo' => now()->addDays(7),
            'status' => 'dipinjam',
            'hari_terlambat' => 0,
            'denda' => 0,
            'status_denda' => 'belum_ada',
        ];
    }
}
