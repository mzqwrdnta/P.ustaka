<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $books = [
            [
                'id' => 3,
                'judul' => 'Sistem Informasi Absensi Siswa Berbasis Web',
                'penulis' => 'Zaqi',
                'kategori' => 'Teknologi',
                'stok' => 4,
                'deskripsi' => 'Buku petunjuk pembuatan sistem absensi.',
                'cover_image' => 'books/ABNYTq7mp3mSXwrYeKUIWE7cmPdrpYZixi9ULN3U.png',
                'status' => 'aktif',
            ],
            [
                'id' => 5,
                'judul' => '(Im)perfect Fate',
                'penulis' => 'Zaqi',
                'kategori' => 'Novel',
                'stok' => 5,
                'deskripsi' => 'Novel tentang takdir yang tidak sempurna.',
                'cover_image' => 'books/n85YPBAwSV9Te7hyhSmnegA3TzF90HxVjyMNuUMY.webp',
                'status' => 'aktif',
            ],
            [
                'id' => 6,
                'judul' => '“BukaLoka” (Buku Kedua dari Trilogi Novel “Crazy Rich Jakarta”)',
                'penulis' => 'Zaqi',
                'kategori' => 'Novel',
                'stok' => 3,
                'deskripsi' => 'Lanjutan dari trilogi Crazy Rich Jakarta.',
                'cover_image' => 'books/J8nzt8Vk6O52tUI7mG9OTXyHFiXHJBMCB2u3yrWu.webp',
                'status' => 'aktif',
            ],
            [
                'id' => 7,
                'judul' => '1984',
                'penulis' => 'George Orwell',
                'kategori' => 'Fiksi Klasik',
                'stok' => 10,
                'deskripsi' => 'Dystopian novel by George Orwell.',
                'cover_image' => 'books/gT3dlYbe0ai6GBW0RmecZx4Nk80L6YKGC9ecWhXi.webp',
                'status' => 'aktif',
            ],
            [
                'id' => 8,
                'judul' => 'Light of Life',
                'penulis' => 'Zaqi',
                'kategori' => 'Inspirational',
                'stok' => 8,
                'deskripsi' => 'Cahaya dalam kehidupan.',
                'cover_image' => 'books/bvaCZpbyKsC81xt5q5KIHX5XZSREs4KSqqjwEsKi.webp',
                'status' => 'aktif',
            ],
            [
                'id' => 9,
                'judul' => '13 THE HAUNTED',
                'penulis' => 'Zaqi',
                'kategori' => 'Horror',
                'stok' => 5,
                'deskripsi' => 'Kisah horor misterius.',
                'cover_image' => 'books/TO7EfAuexqREGPW5bncJvSQ5eM71PfcnfVpGDDqP.webp',
                'status' => 'aktif',
            ],
        ];

        foreach ($books as $book) {
            Book::updateOrCreate(['id' => $book['id']], $book);
        }
    }
}
