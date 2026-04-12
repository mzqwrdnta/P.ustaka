<?php

namespace App\Exports;

use App\Models\Transaction;
use Maatwebsite\Excel\Concerns\FromCollection;

class TransactionsExport implements FromCollection
{
    public function collection()
    {
        return Transaction::with(['member', 'book'])->get();
    }
}