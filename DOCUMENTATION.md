# Dokumentasi Fitur Aplikasi Perpustakaan (P.ustaka)

Dokumen ini menjelaskan alur (*flow*), metode (*methods*), dan pustaka (*libraries*) yang digunakan dalam setiap fitur utama aplikasi.

## Daftar Isi
- [Teknologi Utama](#teknologi-utama)
- [1. Autentikasi & Profil](#1-autentikasi--profil)
- [2. Katalog Buku & Peminjaman (User)](#2-katalog-buku--peminjaman-user)
- [3. Manajemen Transaksi (Admin)](#3-manajemen-transaksi-admin)
- [4. Pengembalian & Perhitungan Denda](#4-pengembalian--perhitungan-denda)
- [5. Sistem Notifikasi WhatsApp](#5-sistem-notifikasi-whatsapp)
- [6. Laporan & Ekspor Data](#6-laporan--ekspor-data)

---

## Teknologi Utama

- **Core**: Laravel 13 + PHP 8.4
- **Frontend**: React 19 + Inertia.js v3 (SPA Feel)
- **Styling**: Tailwind CSS v4
- **Routing**: Laravel Wayfinder (Typed-safe routing)
- **Database**: Eloquent ORM
- **Testing**: Pest v4

---

## 1. Autentikasi & Profil
Aplikasi menggunakan **Laravel Fortify** sebagai backend autentikasi yang *headless*.

- **Flow**:
    1. Registrasi via Fortify (`CreateNewUser.php`).
    2. Login via Fortify.
    3. Middleware mengecek apakah user sudah memiliki data di tabel `members`.
    4. Jika belum, user diarahkan ke halaman **Lengkapi Profil** (`MemberProfileController@create`).
- **Metode**: 
    - `auth()->user()->member`: Menggunakan relasi Eloquent untuk verifikasi profil.
    - `Redirect`: Otomatis diarahkan kembali jika mencoba akses dashboard tanpa profil lengkap.
- **Library**: `laravel/fortify`, `inertiajs/inertia-laravel`.

---

## 2. Katalog Buku & Peminjaman (User)
Fitur bagi siswa untuk mencari dan meminjam buku secara mandiri.

- **Flow**:
    1. User mencari buku via filter (judul, kategori, ketersediaan).
    2. User menekan tombol "Pinjam".
    3. Sistem memvalidasi: Stok buku > 0 dan user tidak sedang meminjam buku yang sama.
    4. Transaksi dibuat dengan status `pending_peminjaman`.
    5. Kirim notifikasi WhatsApp ke Admin.
- **Metode**:
    - `Index`: `UserBookController@index` dengan pagination dan pencarian parsial.
    - `Borrow`: `UserBookController@borrow` pengecekan duplikasi via query `Transaction::where(...)`.
- **Library**: `Inertia` (Render page), `WhatsAppService` (Custom service).

---

## 3. Manajemen Transaksi (Admin)
Admin mengelola siklus hidup peminjaman buku.

- **Flow**:
    1. Admin melihat daftar pengajuan di tab "Peminjaman".
    2. Admin memverifikasi atau menolak (`verifyBorrow` / `rejectBorrow`).
    3. Jika disetujui, stok buku dikurangi secara otomatis dan `tanggal_jatuh_tempo` dihitung berdasarkan pengaturan sistem.
- **Metode**:
    - `verifyBorrow`: `decrement('stok', 1)` pada model `Book`.
    - `Carbon`: Digunakan untuk manipulasi tanggal jatuh tempo (`now()->addDays($maxDays)`).
- **Library**: `Carbon` (Date handling), `Inertia` (Flash messages untuk feedback).

---

## 4. Pengembalian & Perhitungan Denda
Proses verifikasi buku yang dikembalikan dan perhitungan otomatis denda.

- **Flow**:
    1. User mengajukan pengembalian (`UserTransactionController@returnBook`).
    2. Transaksi masuk ke status `pending_pengembalian`.
    3. Admin memverifikasi (`AdminTransactionController@verifyReturn`).
    4. Sistem menghitung selisih hari antara hari ini dan `tanggal_jatuh_tempo`.
    5. Jika terlambat, denda dihitung berdasarkan `denda_per_hari` dari tabel `settings`.
- **Metode**:
    - `diffInDays`: Menghitung selisih hari keterlambatan.
    - `increment('stok', 1)`: Mengembalikan stok buku ke perpustakaan.
    - `AdminFineController@update`: Mencatat pembayaran denda (bisa cicil/parsial).

---

## 5. Sistem Notifikasi WhatsApp
Integrasi notifikasi *real-time* menggunakan penyedia layanan **Fonnte**.

- **Flow**:
    - Otomatis (Trigger): Saat user meminjam/mengembalikan buku, admin mendapat pesan.
    - Manual: Admin dapat mengirim pengingat (*reminder*) keterlambatan ke WhatsApp siswa melalui tombol di daftar transaksi.
- **Metode**:
    - `sendMessage($target, $message)`: Melakukan request HTTP POST ke API Fonnte dengan `Authorization` header.
- **Library**: `Illuminate\Support\Facades\Http` (Laravel HTTP Client).

---

## 6. Laporan & Ekspor Data
Fitur untuk audit mendalam dan pencetakan data transaksi.

- **Flow**:
    1. Admin filter data berdasarkan rentang tanggal, kelas, atau status.
    2. Pilih "Ekspor Excel" atau "Ekspor PDF".
- **Metode**:
    - Excel: Menggunakan *Export Class* (`TransactionsExport`) untuk memetakan data Eloquent ke baris spreadsheet.
    - PDF: Menggunakan template Blade yang di-*render* menjadi file PDF.
- **Library**: 
    - `Maatwebsite/Excel`: Integrasi spreadsheet.
    - `Barryvdh/DomPDF`: Konversi HTML to PDF.

---

*Terakhir diperbarui: 13 April 2026*
