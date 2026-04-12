<h2>Laporan Transaksi</h2>

<table border="1" cellpadding="5" cellspacing="0" width="100%">
    <tr>
        <th>Member</th>
        <th>Buku</th>
        <th>Tanggal Pinjam</th>
        <th>Tanggal Kembali</th>
        <th>Denda</th>
    </tr>

    @foreach($data as $item)
    <tr>
        <td>{{ $item->member->nama_lengkap }}</td>
        <td>{{ $item->book->judul }}</td>
        <td>{{ $item->tanggal_pinjam }}</td>
        <td>{{ $item->tanggal_kembali }}</td>
        <td>{{ $item->denda }}</td>
    </tr>
    @endforeach
</table>