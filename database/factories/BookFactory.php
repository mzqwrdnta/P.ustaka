<?php

namespace Database\Factories;

use App\Models\Book;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Book>
 */
class BookFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kode_buku' => 'BK-' . fake()->unique()->numerify('####'),
            'judul' => fake()->sentence(3),
            'penulis' => fake()->name(),
            'penerbit' => fake()->company(),
            'tahun_terbit' => (string) fake()->year(),
            'kategori' => fake()->randomElement(['Fiksi', 'Non-Fiksi', 'Sains', 'Sejarah']),
            'stok' => fake()->numberBetween(1, 20),
            'deskripsi' => fake()->paragraph(),
            'status' => 'aktif',
        ];
    }
}
