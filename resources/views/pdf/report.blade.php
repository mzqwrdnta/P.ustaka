<!DOCTYPE html>
<html>
<head>
    <title>Laporan Transaksi Perpustakaan</title>
    <style>
        @page { margin: 1cm; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 10pt; color: #333; line-height: 1.4; }
        
        /* Kop Surat */
        .kop-surat { border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 20px; position: relative; }
        .kop-surat h1 { margin: 0; font-size: 18pt; text-transform: uppercase; color: #000; text-align: center; }
        .kop-surat h2 { margin: 5px 0 0; font-size: 14pt; text-transform: uppercase; color: #000; text-align: center; }
        .kop-surat p { margin: 5px 0 0; font-size: 9pt; color: #444; text-align: center; font-style: italic; }
        
        .report-title { text-align: center; margin-bottom: 25px; }
        .report-title h3 { margin: 0; font-size: 13pt; text-decoration: underline; text-transform: uppercase; }
        .report-title p { margin: 5px 0 0; font-size: 10pt; color: #555; }
        
        .stats-container { margin-bottom: 20px; width: 100%; }
        .stats-table { width: 100%; border-collapse: collapse; }
        .stats-table td { padding: 10px; border: 1px solid #eee; background: #fafafa; }
        .stats-label { font-size: 8pt; color: #777; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 3px; }
        .stats-value { font-size: 12pt; font-weight: bold; color: #000; }
        
        .table-data { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        .table-data th { background-color: #f0f0f0; border: 1px solid #ccc; padding: 10px 5px; text-align: center; font-weight: bold; font-size: 9pt; text-transform: uppercase; }
        .table-data td { border: 1px solid #ccc; padding: 8px 5px; font-size: 9pt; vertical-align: middle; }
        .table-data tr:nth-child(even) { background-color: #fcfcfc; }
        
        .footer-info { margin-top: 20px; font-size: 8pt; color: #888; border-top: 1px solid #eee; padding-top: 10px; }
        
        .signature-section { margin-top: 40px; width: 100%; }
        .signature-table { width: 100%; }
        .signature-table td { width: 33%; text-align: center; vertical-align: top; }
        .signature-space { height: 80px; }
        .signature-name { font-weight: bold; text-decoration: underline; }
        
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        
        .status-badge { 
            padding: 2px 6px; 
            border-radius: 3px; 
            font-size: 8pt; 
            font-weight: bold; 
            display: inline-block;
            border: 0.5px solid #ccc;
        }
    </style>
</head>
<body>

@php
    $totalPinjam = $data->count();
    $totalTelat = $data->where('denda', '>', 0)->count();
    $totalDenda = $data->sum('denda');
    
    $monthNames = [
        'January' => 'Januari', 'February' => 'Februari', 'March' => 'Maret',
        'April' => 'April', 'May' => 'Mei', 'June' => 'Juni',
        'July' => 'Juli', 'August' => 'Agustus', 'September' => 'September',
        'October' => 'Oktober', 'November' => 'November', 'December' => 'Desember'
    ];

    $periodLabel = 'SELURUH PERIODE';
    if(request('period_type') == 'harian' && request('period_date')) {
        $d = date('d F Y', strtotime(request('period_date')));
        $periodLabel = 'TANGGAL ' . strtr($d, $monthNames);
    } elseif(request('period_type') == 'bulanan' && request('period_month')) {
        $d = date('F Y', strtotime(request('period_month')));
        $periodLabel = 'BULAN ' . strtoupper(strtr($d, $monthNames));
    } elseif(request('period_type') == 'tahunan' && request('period_year')) {
        $periodLabel = 'TAHUN ' . request('period_year');
    } elseif(request('start_date') && request('end_date')) {
        $s = date('d F Y', strtotime(request('start_date')));
        $e = date('d F Y', strtotime(request('end_date')));
        $periodLabel = strtr($s, $monthNames) . ' S/D ' . strtr($e, $monthNames);
    }
    
    $printDate = strtr(date('d F Y'), $monthNames);
@endphp

    <div class="kop-surat">
        <h1>PERPUSTAKAAN P.USTAKA</h1>
        <h2>LAPORAN TRANSAKSI MUTASI BUKU</h2>
        <p>Jl. Pendidikan No. 123, Kota Digital, Telp: (021) 123456 | Website: www.pustaka.sch.id</p>
    </div>

    <div class="report-title">
        <h3>LAPORAN TRANSAKSI {{ $periodLabel }}</h3>
        <p>Dibuat secara otomatis oleh Sistem Informasi Perpustakaan</p>
    </div>

    <div class="stats-container">
        <table class="stats-table">
            <tr>
                <td width="33%">
                    <span class="stats-label">Total Transaksi</span>
                    <span class="stats-value">{{ $totalPinjam }} Kali</span>
                </td>
                <td width="33%">
                    <span class="stats-label">Total Keterlambatan</span>
                    <span class="stats-value text-amber-600">{{ $totalTelat }} Kasus</span>
                </td>
                <td width="33%">
                    <span class="stats-label">Akumulasi Denda</span>
                    <span class="stats-value text-rose-600">Rp {{ number_format($totalDenda, 0, ',', '.') }}</span>
                </td>
            </tr>
        </table>
    </div>

    <table class="table-data">
        <thead>
            <tr>
                <th width="35">NO</th>
                <th width="150">NAMA ANGGOTA / NIS</th>
                <th width="80">KELAS</th>
                <th>JUDUL BUKU</th>
                <th width="100">TGL PINJAM</th>
                <th width="100">TGL KEMBALI</th>
                <th width="100">STATUS</th>
                <th width="100">DENDA</th>
            </tr>
        </thead>
        <tbody>
            @forelse($data as $idx => $item)
            <tr>
                <td class="text-center">{{ $idx + 1 }}</td>
                <td>
                    <span class="font-bold">{{ $item->member->nama_lengkap ?? '-' }}</span><br>
                    <small style="color:#666">{{ $item->member->nis ?? '' }}</small>
                </td>
                <td class="text-center">{{ $item->member->kelas ?? '-' }}</td>
                <td>{{ $item->book->judul ?? '-' }}</td>
                <td class="text-center">{{ $item->tanggal_pinjam ? date('d/m/Y', strtotime($item->tanggal_pinjam)) : '-' }}</td>
                <td class="text-center">{{ $item->tanggal_kembali ? date('d/m/Y', strtotime($item->tanggal_kembali)) : '-' }}</td>
                <td class="text-center">
                    <span class="status-badge">{{ strtoupper(str_replace('_', ' ', $item->status)) }}</span>
                </td>
                <td class="text-right">
                    @if($item->denda > 0)
                        <span class="font-bold">Rp {{ number_format($item->denda, 0, ',', '.') }}</span>
                    @else
                        <span style="color:#ccc">-</span>
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="8" style="text-align:center; padding:30px; color:#999">
                    Data tidak ditemukan untuk periode pencarian ini.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="signature-section">
        <table class="signature-table">
            <tr>
                <td>
                    <p>Mengetahui,</p>
                    <p>Kepala Perpustakaan</p>
                    <div class="signature-space"></div>
                    <p class="signature-name">( ____________________ )</p>
                    <p>NIP. .........................</p>
                </td>
                <td></td>
                <td>
                    <p>Kota Digital, {{ $printDate }}</p>
                    <p>Petugas Administrasi</p>
                    <div class="signature-space"></div>
                    <p class="signature-name">( ____________________ )</p>
                    <p>NIP. .........................</p>
                </td>
            </tr>
        </table>
    </div>

    <div class="footer-info text-right">
        Dokumen ini sah dan dicetak melalui Sistem Informasi Perpustakaan pada {{ date('d/m/Y H:i') }}
    </div>

</body>
</html>