<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('kode_transaksi')->unique();
            $table->foreignId('member_id')->constrained()->cascadeOnDelete();
            $table->foreignId('book_id')->constrained()->cascadeOnDelete();
            $table->date('tanggal_pinjam')->nullable();
            $table->date('tanggal_jatuh_tempo')->nullable();
            $table->date('tanggal_pengajuan_kembali')->nullable();
            $table->date('tanggal_kembali')->nullable();
            $table->string('status'); 
            $table->integer('hari_terlambat')->default(0);
            $table->integer('denda')->default(0);
            $table->string('status_denda')->default('belum_ada');
            $table->text('catatan_admin')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
