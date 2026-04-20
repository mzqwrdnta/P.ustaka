import React from 'react';

export function formatDate(d?: string | null): string {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

const BOOK_PATTERN_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
  <g opacity='0.09' fill='none' stroke='%231a3a8f' stroke-width='1'>
    <path d='M10 18 Q18 12 26 18 L26 30 Q18 24 10 30Z'/>
    <path d='M26 18 Q34 12 42 18 L42 30 Q34 24 26 30Z'/>
    <line x1='26' y1='18' x2='26' y2='30'/>
    <path d='M50 8 Q58 2 66 8 Q58 14 50 8Z'/>
    <line x1='58' y1='8' x2='56' y2='18'/>
    <path d='M8 52 Q16 46 24 52 L24 62 Q16 56 8 62Z'/>
    <path d='M55 55 Q63 49 71 55 Q63 61 55 55Z'/>
  </g>
</svg>`;

const BOOK_PATTERN_URL = `data:image/svg+xml,${BOOK_PATTERN_SVG.replace(/\n/g, '').replace(/  +/g, ' ')}`;

const barWidths = [1, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 1, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 1];

export default function MemberCard({ member }: { member: any }) {
    if (!member) return null;

    const fotoUrl = member.foto ? `/storage/${member.foto}` : null;
    const initial = member.nama_lengkap?.charAt(0)?.toUpperCase() || '?';
    const isActive = member.status_aktif;

    const accentColor = isActive
        ? 'linear-gradient(90deg, #1a3a8f 0%, #3563c4 50%, #5b8af5 100%)'
        : 'linear-gradient(90deg, #7f1d1d 0%, #b91c1c 50%, #ef4444 100%)';

    const titleColor = isActive ? '#1a3a8f' : '#7f1d1d';
    const subColor = isActive ? '#3563c4' : '#b91c1c';

    return (
        <div style={{
            width: '85.6mm',
            height: '54mm',
            borderRadius: '14px',
            overflow: 'hidden',
            fontFamily: "'Segoe UI', Arial, sans-serif",
            background: '#f8f9fb',
            backgroundImage: `url("${BOOK_PATTERN_URL}")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '80px 80px',
            position: 'relative',
            boxShadow: '0 4px 20px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
            border: '0.5px solid #d0d5e0',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* ── ACCENT BAR ── */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '4px',
                background: accentColor,
                zIndex: 2,
            }} />

            {/* ── CARD INNER ── */}
            <div style={{
                padding: '14px 14px 12px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative',
                zIndex: 1,
                boxSizing: 'border-box',
            }}>

                {/* ── HEADER ── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    paddingTop: '4px',
                    marginBottom: '8px',
                }}>
                    {/* Title block */}
                    <div>
                        <div style={{
                            fontSize: '13px',
                            fontWeight: 900,
                            color: titleColor,
                            letterSpacing: '0.06em',
                            lineHeight: 1,
                            textTransform: 'uppercase',
                        }}>
                            Library Card
                        </div>
                        <div style={{
                            fontSize: '8px',
                            fontWeight: 600,
                            color: subColor,
                            letterSpacing: '0.03em',
                            marginTop: '2px',
                        }}>
                            P.ustaka — Perpustakaan Sekolah
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '7px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        padding: '2px 7px',
                        borderRadius: '20px',
                        color: isActive ? '#166534' : '#991b1b',
                        background: isActive ? '#dcfce7' : '#fee2e2',
                        border: `0.5px solid ${isActive ? '#86efac' : '#fca5a5'}`,
                    }}>
                        <span style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: isActive ? '#16a34a' : '#dc2626',
                            display: 'inline-block',
                        }} />
                        {isActive ? 'Aktif' : 'Nonaktif'}
                    </div>
                </div>

                {/* ── DIVIDER ── */}
                <div style={{ height: '0.5px', background: '#e2e5f0', marginBottom: '0' }} />

                {/* ── BODY ── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',        // ← center vertical sesuai tinggi foto
                    justifyContent: 'space-between',
                    flex: 1,
                    gap: '14px',
                }}>
                    {/* Info kiri */}
                    <div style={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                    }}>
                        {/* Nama */}
                        <div style={{
                            fontSize: '14px',
                            fontWeight: 900,
                            color: '#0f172a',
                            lineHeight: 1.2,
                            marginBottom: '4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                            {member.nama_lengkap}
                        </div>

                        {/* Member ID */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{
                                fontSize: '7px',
                                color: '#94a3b8',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                                minWidth: '42px',
                            }}>
                                Member ID
                            </span>
                            <span style={{
                                fontSize: '7.5px',
                                color: '#1e293b',
                                fontWeight: 700,
                                fontFamily: 'monospace',
                            }}>
                                {member.nis}
                            </span>
                        </div>

                        {/* Kelas */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{
                                fontSize: '7px',
                                color: '#94a3b8',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                                minWidth: '42px',
                            }}>
                                Kelas
                            </span>
                            <span style={{ fontSize: '7.5px', color: '#334155', fontWeight: 600 }}>
                                {member.kelas}
                            </span>
                        </div>

                        {/* Jenis Kelamin */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{
                                fontSize: '7px',
                                color: '#94a3b8',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                                minWidth: '42px',
                            }}>
                                Jenis Kel.
                            </span>
                            <span style={{ fontSize: '7.5px', color: '#334155', fontWeight: 600 }}>
                                {member.jenis_kelamin}
                            </span>
                        </div>
                    </div>

                    {/* Foto + Barcode kanan */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        flexShrink: 0,
                    }}>
                        {/* Foto */}
                        <div style={{
                            width: '52px',
                            height: '64px',
                            borderRadius: '6px',
                            border: '1.5px solid #d0d5e8',
                            background: '#c9cdd9',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            {fotoUrl
                                ? <img
                                    src={fotoUrl}
                                    alt={member.nama_lengkap}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                : <span style={{
                                    fontSize: '20px',
                                    fontWeight: 900,
                                    color: '#fff',
                                    fontFamily: 'Georgia, serif',
                                }}>
                                    {initial}
                                </span>
                            }
                        </div>

                        {/* Barcode */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1px', height: '20px' }}>
                                {barWidths.map((w, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: `${w + 0.5}px`,
                                            height: i % 5 === 0 ? '20px' : i % 3 === 0 ? '15px' : '11px',
                                            background: '#1e293b',
                                            borderRadius: '0.5px',
                                            flexShrink: 0,
                                        }}
                                    />
                                ))}
                            </div>
                            <div style={{
                                fontSize: '6px',
                                fontFamily: 'monospace',
                                color: '#475569',
                                letterSpacing: '0.1em',
                                fontWeight: 600,
                            }}>
                                {member.nis}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── FOOTER ── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '6px',
                    borderTop: '0.5px solid #e8eaf2',
                    marginTop: '6px',
                }}>
                    <span style={{ fontSize: '6.5px', color: '#94a3b8', fontWeight: 500 }}>
                        Terdaftar
                    </span>
                    <span style={{ fontSize: '6.5px', color: '#64748b', fontWeight: 600 }}>
                        {formatDate(member.created_at)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export function generateCardHtml(m: any): string {
    const fotoUrl = m.foto ? `/storage/${m.foto}` : null;
    const initial = m.nama_lengkap?.charAt(0)?.toUpperCase() || '?';
    const isActive = m.status_aktif;

    const avatarContent = fotoUrl
        ? `<img src="${fotoUrl}" style="width:100%;height:100%;object-fit:cover;" />`
        : `<span style="font-size:20px;font-weight:900;color:#fff;font-family:Georgia,serif;">${initial}</span>`;

    const accentColor = isActive
        ? 'linear-gradient(90deg,#1a3a8f,#3563c4,#5b8af5)'
        : 'linear-gradient(90deg,#7f1d1d,#b91c1c,#ef4444)';

    const titleColor = isActive ? '#1a3a8f' : '#7f1d1d';
    const subColor = isActive ? '#3563c4' : '#b91c1c';

    const badgeStyle = isActive
        ? 'color:#166534;background:#dcfce7;border:0.5px solid #86efac;'
        : 'color:#991b1b;background:#fee2e2;border:0.5px solid #fca5a5;';
    const dotColor = isActive ? '#16a34a' : '#dc2626';
    const badgeText = isActive ? 'Aktif' : 'Nonaktif';

    const widths = [1, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 1, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 1];
    const barsHtml = widths.map((w, i) => {
        const h = i % 5 === 0 ? '20px' : i % 3 === 0 ? '15px' : '11px';
        return `<div style="width:${w + 0.5}px;height:${h};background:#1e293b;border-radius:0.5px;flex-shrink:0;"></div>`;
    }).join('');

    const bookPattern = encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><g opacity='0.09' fill='none' stroke='%231a3a8f' stroke-width='1'><path d='M10 18 Q18 12 26 18 L26 30 Q18 24 10 30Z'/><path d='M26 18 Q34 12 42 18 L42 30 Q34 24 26 30Z'/><line x1='26' y1='18' x2='26' y2='30'/><path d='M50 8 Q58 2 66 8 Q58 14 50 8Z'/><line x1='58' y1='8' x2='56' y2='18'/><path d='M8 52 Q16 46 24 52 L24 62 Q16 56 8 62Z'/><path d='M55 55 Q63 49 71 55 Q63 61 55 55Z'/></g></svg>`
    );

    return `
<div style="
    width:250px;height:150px;
    border-radius:14px;overflow:hidden;
    font-family:'Segoe UI',Arial,sans-serif;
    background:#f8f9fb url('data:image/svg+xml,${bookPattern}') repeat;
    background-size:80px 80px;
    position:relative;
    box-shadow:0 4px 20px rgba(0,0,0,0.10),0 1px 4px rgba(0,0,0,0.06);
    border:0.5px solid #d0d5e0;
    box-sizing:border-box;
    display:flex;flex-direction:column;
    page-break-inside:avoid;
">
    <!-- ACCENT BAR -->
    <div style="position:absolute;top:0;left:0;right:0;height:4px;background:${accentColor};z-index:2;"></div>

    <!-- INNER -->
    <div style="padding:14px 14px 12px;display:flex;flex-direction:column;height:100%;position:relative;z-index:1;box-sizing:border-box;">

        <!-- HEADER -->
        <div style="display:flex;align-items:flex-start;justify-content:space-between;padding-top:4px;margin-bottom:8px;">
            <div>
                <div style="font-size:13px;font-weight:900;color:${titleColor};letter-spacing:0.06em;text-transform:uppercase;line-height:1;">Library Card</div>
                <div style="font-size:8px;font-weight:600;color:${subColor};letter-spacing:0.03em;margin-top:2px;">P.ustaka — Perpustakaan Sekolah</div>
            </div>
            <div style="display:inline-flex;align-items:center;gap:3px;font-size:7px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;padding:2px 7px;border-radius:20px;${badgeStyle}">
                <span style="width:5px;height:5px;border-radius:50%;background:${dotColor};display:inline-block;"></span>
                ${badgeText}
            </div>
        </div>

        <!-- DIVIDER -->
        <div style="height:0.5px;background:#e2e5f0;margin-bottom:0;"></div>

        <!-- BODY -->
        <div style="display:flex;align-items:center;justify-content:space-between;flex:1;gap:14px;">

            <!-- INFO KIRI -->
            <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;">
                <div style="font-size:11px;font-weight:900;color:#0f172a;line-height:1.2;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${m.nama_lengkap}</div>

                <div style="display:flex;align-items:center;gap:5px;">
                    <span style="font-size:7px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;min-width:42px;">Member ID</span>
                    <span style="font-size:7.5px;color:#1e293b;font-weight:700;font-family:monospace;">${m.nis}</span>
                </div>

                <div style="display:flex;align-items:center;gap:5px;">
                    <span style="font-size:7px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;min-width:42px;">Kelas</span>
                    <span style="font-size:7.5px;color:#334155;font-weight:600;">${m.kelas}</span>
                </div>

                <div style="display:flex;align-items:center;gap:5px;">
                    <span style="font-size:7px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;min-width:42px;">Jenis Kel.</span>
                    <span style="font-size:7.5px;color:#334155;font-weight:600;">${m.jenis_kelamin}</span>
                </div>
            </div>

            <!-- FOTO + BARCODE KANAN -->
            <div style="display:flex;flex-direction:column;align-items:center;gap:6px;flex-shrink:0;">
                <div style="width:36px;height:50px;border-radius:6px;border:1.5px solid #d0d5e8;background:#c9cdd9;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    ${avatarContent}
                </div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
                    <div style="display:flex;align-items:flex-end;gap:1px;height:20px;">${barsHtml}</div>
                    <div style="font-size:6px;font-family:monospace;color:#475569;letter-spacing:0.1em;font-weight:600;">${m.nis}</div>
                </div>
            </div>
        </div>

        <!-- FOOTER -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding-top:6px;border-top:0.5px solid #e8eaf2;margin-top:6px;">
            <span style="font-size:6.5px;color:#94a3b8;font-weight:500;">Terdaftar</span>
            <span style="font-size:6.5px;color:#64748b;font-weight:600;">${formatDate(m.created_at)}</span>
        </div>
    </div>
</div>`;
}

export function printCards(members: any[]) {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;

    const cardsHtml = members.map(m => generateCardHtml(m)).join('');

    printWindow.document.write(`
        <html>
            <head>
                <title>Cetak Kartu Anggota</title>
                <style>
                    body { margin: 0; background: #f8f9fb; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
                    @media print {
                        @page { size: A4; margin: 10mm; }
                        body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        .no-print { display: none !important; }
                        .print-container { 
                            display: grid !important; 
                            grid-template-columns: repeat(2, 1fr) !important; 
                            gap: 10mm !important; 
                            padding: 5mm !important;
                            justify-items: center !important;
                        }
                    }
                    .print-container {
                        display: flex; flex-wrap: wrap; gap: 20px; padding: 30px; justify-content: center;
                    }
                </style>
            </head>
            <body>
                <div class="no-print" style="padding:12px 24px;background:#0f172a;color:#f8f9fb;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:999;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                    <div style="font-size:14px;font-weight:600;"><span style="color:#fbbf24;font-weight:900;">${members.length}</span> Kartu Anggota Digital</div>
                    <button onclick="window.print()" style="background:#fbbf24;color:#0f172a;border:none;padding:8px 24px;border-radius:8px;font-weight:900;cursor:pointer;font-size:13px;letter-spacing:.05em;text-transform:uppercase;transition:all 0.2s;">🖨 Cetak Sekarang</button>
                </div>
                <div class="print-container">
                    ${cardsHtml}
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
}