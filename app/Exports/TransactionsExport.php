<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class TransactionsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $data;

    public function __construct(Collection $data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        return $this->data;
    }

    public function headings(): array
    {
        return [
            'ID Transaksi',
            'Anggota',
            'Kelas',
            'Buku',
            'Tgl Pinjam',
            'Tgl Kembali',
            'Status',
            'Denda (Rp)',
        ];
    }

    public function map($row): array
    {
        return [
            $row->id,
            $row->member->nama_lengkap ?? '-',
            $row->member->kelas ?? '-',
            $row->book->judul ?? '-',
            $row->tanggal_pinjam ? date('d-m-Y', strtotime($row->tanggal_pinjam)) : '-',
            $row->tanggal_kembali ? date('d-m-Y', strtotime($row->tanggal_kembali)) : '-',
            str_replace('_', ' ', $row->status),
            $row->denda ?? 0,
        ];
    }
}
