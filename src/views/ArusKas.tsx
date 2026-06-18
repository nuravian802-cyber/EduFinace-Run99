import React, { useState, useMemo } from 'react';
import { Printer, ArrowRightLeft } from 'lucide-react';
import { useStore } from '../store/useStore';

const ArusKas: React.FC = () => {
  const { transaksi, kategori, currentUser, profilSekolah, akunKas } = useStore();
  const isKepsek = currentUser?.role === 'Kepala Sekolah';
  const [periodeMulai, setPeriodeMulai] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [periodeAkhir, setPeriodeAkhir] = useState(new Date().toISOString().split('T')[0]);

  const { validTransaksi, totalMasuk, totalKeluar, kasAwalPeriode, kasAkhirPeriode, kenaikanPenurunan } = useMemo(() => {
    const valid = transaksi
      .filter(t => t.tanggal >= periodeMulai && t.tanggal <= periodeAkhir)
      .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
    
    let tMasuk = 0;
    let tKeluar = 0;

    valid.forEach(t => {
      if (t.tipe === 'Pemasukan') tMasuk += t.nominal;
      else tKeluar += t.nominal;
    });

    // Menghitung Kas Awal Periode berdasarkan total saldo saat ini dikurangi net flow sejak periodeMulai
    const currentTotalSaldo = akunKas.reduce((sum, a) => sum + a.saldo, 0);
    
    let netFlowAfterStart = 0;
    transaksi.forEach(t => {
      if (t.tanggal >= periodeMulai) {
        if (t.tipe === 'Pemasukan') netFlowAfterStart += t.nominal;
        else netFlowAfterStart -= t.nominal;
      }
    });

    const kasAwal = currentTotalSaldo - netFlowAfterStart;
    const netFlow = tMasuk - tKeluar;
    const kasAkhir = kasAwal + netFlow;

    return { 
      validTransaksi: valid, 
      totalMasuk: tMasuk, 
      totalKeluar: tKeluar,
      kasAwalPeriode: kasAwal,
      kasAkhirPeriode: kasAkhir,
      kenaikanPenurunan: netFlow
    };
  }, [transaksi, akunKas, periodeMulai, periodeAkhir]);

  return (
    <div className="animate-fade-in">
      <div className="page-header no-print">
        <div>
          <h2>Laporan Arus Kas (Cash Flow)</h2>
          <p>Laporan pergerakan kas masuk dan keluar secara keseluruhan.</p>
        </div>
        {!isKepsek && (
        <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={18} /> Cetak Laporan
          </button>
        </div>
        )}
      </div>

      <div className="paper-container print-area">
        {/* Header Kertas Laporan */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', borderBottom: '3px solid var(--text-main)', paddingBottom: '1.5rem' }}>
          <h1 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.8rem' }}>{profilSekolah?.nama || 'EduFinance'}</h1>
          <h2 style={{ margin: '0.5rem 0', color: 'var(--text-main)', fontSize: '1.4rem' }}>Laporan Arus Kas</h2>
          <p style={{ margin: 0, fontWeight: 600 }}>Periode: {new Date(periodeMulai).toLocaleDateString('id-ID')} s.d {new Date(periodeAkhir).toLocaleDateString('id-ID')}</p>
        </div>

        <div className="no-print" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label className="form-label">Periode Mulai</label>
            <input type="date" className="form-control" value={periodeMulai} onChange={(e) => setPeriodeMulai(e.target.value)} />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label className="form-label">Periode Akhir</label>
            <input type="date" className="form-control" value={periodeAkhir} onChange={(e) => setPeriodeAkhir(e.target.value)} />
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <ArrowRightLeft size={24} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Laporan Arus Kas</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e293b', color: 'white' }}>
                  <th style={{ padding: '1rem', width: '20%', fontWeight: 600 }}>Tanggal</th>
                  <th style={{ padding: '1rem', width: '40%', fontWeight: 600 }}>Uraian</th>
                  <th style={{ padding: '1rem', textAlign: 'center', width: '20%', fontWeight: 600 }}>Kas Masuk</th>
                  <th style={{ padding: '1rem', textAlign: 'center', width: '20%', fontWeight: 600 }}>Kas Keluar</th>
                </tr>
              </thead>
              <tbody>
                {validTransaksi.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>{t.tanggal}</td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{t.keterangan || (t.kategoriId ? kategori.find(k => k.id?.toString() === t.kategoriId?.toString())?.nama : 'Lainnya')}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: t.tipe === 'Pemasukan' ? 'var(--success)' : 'inherit', fontWeight: t.tipe === 'Pemasukan' ? 600 : 'normal' }}>
                      {t.tipe === 'Pemasukan' ? `Rp ${t.nominal.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: t.tipe === 'Pengeluaran' ? 'var(--danger)' : 'inherit', fontWeight: t.tipe === 'Pengeluaran' ? 600 : 'normal' }}>
                      {t.tipe === 'Pengeluaran' ? `Rp ${t.nominal.toLocaleString('id-ID')}` : '-'}
                    </td>
                  </tr>
                ))}
                {validTransaksi.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Tidak ada transaksi pada periode ini.</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#f1f5f9' }}>
                  <td colSpan={2} style={{ padding: '1rem', textAlign: 'center', fontWeight: 800, fontSize: '1.05rem' }}>TOTAL</td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--success)', fontWeight: 800 }}>Rp {totalMasuk.toLocaleString('id-ID')}</td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--danger)', fontWeight: 800 }}>Rp {totalKeluar.toLocaleString('id-ID')}</td>
                </tr>
              </tfoot>
            </table>

            {/* Ringkasan Arus Kas (Akuntansi) */}
            <div style={{ marginTop: '2rem', padding: '1rem', width: '100%', maxWidth: '600px', marginLeft: 'auto', fontSize: '1.05rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', marginBottom: '0.5rem' }}>
                <span>Kenaikan (Penurunan) kas</span>
                <span style={{ color: kenaikanPenurunan < 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>
                  {kenaikanPenurunan < 0 ? `(${Math.abs(kenaikanPenurunan).toLocaleString('id-ID')})` : kenaikanPenurunan.toLocaleString('id-ID')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', marginBottom: '0.5rem' }}>
                <span>Kas pada awal periode</span>
                <span style={{ fontWeight: 600 }}>{kasAwalPeriode.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', borderTop: '2px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <span style={{ fontWeight: 700 }}>Kas pada akhir periode</span>
                <span style={{ fontWeight: 700 }}>{kasAkhirPeriode.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArusKas;
