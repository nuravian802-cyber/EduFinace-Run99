import React, { useState, useMemo } from 'react';
import { Printer } from 'lucide-react';
import { useStore } from '../store/useStore';

const ArusKas: React.FC = () => {
  const { transaksi, kategori } = useStore();
  const [periodeMulai, setPeriodeMulai] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [periodeAkhir, setPeriodeAkhir] = useState(new Date().toISOString().split('T')[0]);

  const { masuk, keluar, totalMasuk, totalKeluar } = useMemo(() => {
    const validTransaksi = transaksi.filter(t => t.tanggal >= periodeMulai && t.tanggal <= periodeAkhir);
    
    const masuk = validTransaksi.filter(t => t.tipe === 'Pemasukan');
    const keluar = validTransaksi.filter(t => t.tipe === 'Pengeluaran');

    // Group by kategori
    const groupMasuk: Record<string, number> = {};
    const groupKeluar: Record<string, number> = {};

    masuk.forEach(t => {
      const nama = t.kategoriId ? kategori.find(k => k.id === t.kategoriId)?.nama : t.tagihanId ? 'Pembayaran Tagihan Siswa' : 'Pemasukan Lainnya';
      const key = nama || 'Lainnya';
      groupMasuk[key] = (groupMasuk[key] || 0) + t.nominal;
    });

    keluar.forEach(t => {
      const nama = t.kategoriId ? kategori.find(k => k.id === t.kategoriId)?.nama : 'Pengeluaran Lainnya';
      const key = nama || 'Lainnya';
      groupKeluar[key] = (groupKeluar[key] || 0) + t.nominal;
    });

    const totalMasuk = masuk.reduce((sum, t) => sum + t.nominal, 0);
    const totalKeluar = keluar.reduce((sum, t) => sum + t.nominal, 0);

    return { masuk: groupMasuk, keluar: groupKeluar, totalMasuk, totalKeluar };
  }, [transaksi, kategori, periodeMulai, periodeAkhir]);

  const kasBersih = totalMasuk - totalKeluar;

  return (
    <div className="animate-fade-in">
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Laporan Arus Kas (Cash Flow)</h2>
          <p>Laporan pergerakan kas masuk dan keluar secara keseluruhan.</p>
        </div>
        <button className="btn btn-outline" onClick={() => window.print()}>
          <Printer size={18} /> Cetak Laporan
        </button>
      </div>

      <div className="paper-container print-area">
        {/* Header Kertas Laporan */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', borderBottom: '3px solid var(--text-main)', paddingBottom: '1.5rem' }}>
          <h1 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.8rem' }}>EduFinance</h1>
          <h2 style={{ margin: '0.5rem 0', color: 'var(--text-main)', fontSize: '1.4rem' }}>Laporan Arus Kas</h2>
          <p style={{ margin: 0, fontWeight: 600 }}>Periode: {new Date(periodeMulai).toLocaleDateString('id-ID')} s.d {new Date(periodeAkhir).toLocaleDateString('id-ID')}</p>
        </div>

        <div className="no-print" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">Periode Mulai</label>
            <input type="date" className="form-control" value={periodeMulai} onChange={(e) => setPeriodeMulai(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="form-label">Periode Akhir</label>
            <input type="date" className="form-control" value={periodeAkhir} onChange={(e) => setPeriodeAkhir(e.target.value)} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid var(--border-color)' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', width: '70%', color: 'var(--text-main)' }}>Keterangan</th>
                <th style={{ padding: '1rem', textAlign: 'right', width: '30%', color: 'var(--text-main)' }}>Nominal (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {/* Arus Kas Masuk */}
              <tr>
                <td colSpan={2} style={{ padding: '1rem', fontWeight: 700, color: 'var(--success)', backgroundColor: '#f0fdf4', borderBottom: '1px solid var(--border-color)' }}>
                  Arus Kas Masuk (Penerimaan)
                </td>
              </tr>
              {Object.entries(masuk).map(([name, amount]) => (
                <tr key={name} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem 0.75rem 2.5rem' }}>{name}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>{amount.toLocaleString('id-ID')}</td>
                </tr>
              ))}
              {Object.keys(masuk).length === 0 && (
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td colSpan={2} style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>Tidak ada transaksi.</td>
                </tr>
              )}
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: 700 }}>Total Arus Kas Masuk</td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, color: 'var(--success)' }}>
                  {totalMasuk.toLocaleString('id-ID')}
                </td>
              </tr>

              {/* Arus Kas Keluar */}
              <tr>
                <td colSpan={2} style={{ padding: '1rem', fontWeight: 700, color: 'var(--danger)', backgroundColor: '#fef2f2', borderBottom: '1px solid var(--border-color)' }}>
                  Arus Kas Keluar (Pengeluaran)
                </td>
              </tr>
              {Object.entries(keluar).map(([name, amount]) => (
                <tr key={name} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem 0.75rem 2.5rem' }}>{name}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>({amount.toLocaleString('id-ID')})</td>
                </tr>
              ))}
              {Object.keys(keluar).length === 0 && (
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td colSpan={2} style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>Tidak ada transaksi.</td>
                </tr>
              )}
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: 700 }}>Total Arus Kas Keluar</td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, color: 'var(--danger)' }}>
                  ({totalKeluar.toLocaleString('id-ID')})
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: kasBersih >= 0 ? 'var(--primary)' : 'var(--danger)', color: 'white' }}>
                <td style={{ padding: '1.25rem 1rem', fontWeight: 700, fontSize: '1.1rem' }}>
                  Saldo Akhir
                </td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'right', fontWeight: 700, fontSize: '1.1rem' }}>
                  {kasBersih < 0 ? `(${Math.abs(kasBersih).toLocaleString('id-ID')})` : kasBersih.toLocaleString('id-ID')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ArusKas;
