import React, { useState, useMemo } from 'react';
import { Filter, Printer } from 'lucide-react';
import { useStore } from '../store/useStore';

const formatKeterangan = (ket: string) => {
  if (!ket) return ket;
  if (ket.startsWith('Pembayaran ') || ket.startsWith('Diskon: ') || ket.startsWith('Potongan/Diskon ')) {
    const parts = ket.split(' - ');
    if (parts.length > 1) {
      return parts.slice(0, -1).join(' - ');
    }
  }
  return ket;
};

const BukuBesar: React.FC = () => {
  const { akunKas, transaksi, kategori } = useStore();
  const [akunId, setAkunId] = useState('');
  const [periodeMulai, setPeriodeMulai] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [periodeAkhir, setPeriodeAkhir] = useState(new Date().toISOString().split('T')[0]);
  const [kodeTransaksi, setKodeTransaksi] = useState(''); // '' untuk semua, 'YS' atau 'SA'

  const filteredTransaksi = useMemo(() => {
    if (!akunId) return [];
    let filtered = transaksi.filter(t => t.akunId === akunId && t.tanggal >= periodeMulai && t.tanggal <= periodeAkhir);
    
    if (kodeTransaksi === 'YS') {
      filtered = filtered.filter(t => t.keterangan.includes('YS'));
    } else if (kodeTransaksi === 'SA') {
      filtered = filtered.filter(t => t.keterangan.includes('SA'));
    }

    return filtered.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
  }, [transaksi, akunId, periodeMulai, periodeAkhir, kodeTransaksi]);

  const selectedAkun = akunKas.find(a => a.id === akunId);
  
  const saldoAwal = useMemo(() => {
    if (!akunId) return 0;
    let pastTransactions = transaksi.filter(t => t.akunId === akunId && t.tanggal < periodeMulai);
    
    if (kodeTransaksi === 'YS') {
      pastTransactions = pastTransactions.filter(t => t.keterangan.includes('YS'));
    } else if (kodeTransaksi === 'SA') {
      pastTransactions = pastTransactions.filter(t => t.keterangan.includes('SA'));
    }

    return pastTransactions.reduce((sum, t) => {
      return t.tipe === 'Pemasukan' ? sum + t.nominal : sum - t.nominal;
    }, 0);
  }, [transaksi, akunId, periodeMulai, kodeTransaksi]);

  let currentRunningSaldo = saldoAwal;

  return (
    <div className="animate-fade-in">
      <style>
        {`
          @media print {
            @page {
              size: 215mm 330mm; /* F4 */
              margin: 15mm;
            }
            body, html, .app-layout, .main-content, .card, .table-responsive-print {
              overflow-x: hidden !important;
            }
            .print-only {
              display: block !important;
            }
            .table-responsive-print {
              overflow-y: visible !important;
            }
            ::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
            }
          }
        `}
      </style>
      <div className="page-header">
        <div>
          <h2>Laporan Buku Besar</h2>
          <p>Rincian pergerakan transaksi per akun kas.</p>
        </div>
        <button className="btn btn-primary no-print" onClick={() => window.print()} disabled={!akunId}>
          <Printer size={18} style={{ marginRight: '0.5rem' }} />
          Cetak F4
        </button>
      </div>

      <div className="card print-area">
        <div className="no-print" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label className="form-label">Pilih Akun Kas</label>
            <select className="form-control" value={akunId} onChange={(e) => setAkunId(e.target.value)}>
              <option value="">-- Pilih Akun --</option>
              {akunKas.map(a => (
                <option key={a.id} value={a.id}>{a.kode} - {a.nama}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: '1 1 200px', display: 'flex', gap: '0.5rem' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Mulai Tanggal</label>
              <input type="date" className="form-control" value={periodeMulai} onChange={(e) => setPeriodeMulai(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">Sampai Tanggal</label>
              <input type="date" className="form-control" value={periodeAkhir} onChange={(e) => setPeriodeAkhir(e.target.value)} />
            </div>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label className="form-label">Kode Transaksi</label>
            <select className="form-control" value={kodeTransaksi} onChange={(e) => setKodeTransaksi(e.target.value)}>
              <option value="">Semua Transaksi</option>
              <option value="YS">Transaksi YS (Yayasan)</option>
              <option value="SA">Transaksi SA (SMP Assa'adah)</option>
            </select>
          </div>
        </div>

        {akunId ? (
          <div>
            <div className="print-only" style={{ display: 'none', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700 }}>Laporan Buku Besar</h3>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary)' }}>Akun: {selectedAkun?.kode} - {selectedAkun?.nama}</h4>
                  <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>Periode: {periodeMulai} s/d {periodeAkhir}</p>
                </div>
              </div>
            </div>
            <div className="table-responsive-print" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Tanggal</th>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Uraian</th>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Pos Kategori</th>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Debit</th>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Kredit</th>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Saldo Kumulatif</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransaksi.map((t) => {
                    if (t.tipe === 'Pemasukan') currentRunningSaldo += t.nominal;
                    else currentRunningSaldo -= t.nominal;

                    return (
                      <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '1rem 0.5rem' }}>{t.tanggal}</td>
                        <td style={{ padding: '1rem 0.5rem' }}>{formatKeterangan(t.keterangan)}</td>
                        <td style={{ padding: '1rem 0.5rem' }}>{t.kategoriId ? kategori.find(k => k.id?.toString() === t.kategoriId?.toString())?.nama || '-' : '-'}</td>
                        <td style={{ padding: '1rem 0.5rem', textAlign: 'right', color: t.tipe === 'Pemasukan' ? 'var(--success)' : 'inherit', fontWeight: t.tipe === 'Pemasukan' ? 600 : 'normal' }}>
                          {t.tipe === 'Pemasukan' ? t.nominal.toLocaleString('id-ID') : '-'}
                        </td>
                        <td style={{ padding: '1rem 0.5rem', textAlign: 'right', color: t.tipe === 'Pengeluaran' ? 'var(--danger)' : 'inherit', fontWeight: t.tipe === 'Pengeluaran' ? 600 : 'normal' }}>
                          {t.tipe === 'Pengeluaran' ? t.nominal.toLocaleString('id-ID') : '-'}
                        </td>
                        <td style={{ padding: '1rem 0.5rem', textAlign: 'right', fontWeight: 600 }}>{currentRunningSaldo.toLocaleString('id-ID')}</td>
                      </tr>
                    );
                  })}
                  {filteredTransaksi.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Tidak ada transaksi pada periode ini untuk akun tersebut.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr style={{ backgroundColor: 'var(--bg-body)', borderTop: '2px solid var(--border-color)', borderBottom: '2px solid var(--border-color)' }}>
                    <td colSpan={5} style={{ padding: '1rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px', textAlign: 'right' }}>SALDO AKHIR (AKTUAL)</td>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 800, color: 'var(--primary)', textAlign: 'right', fontSize: '1.1rem' }}>
                      Rp {(selectedAkun?.saldo || 0).toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Silakan pilih akun kas dan periode untuk menampilkan buku besar.
          </div>
        )}
      </div>
    </div>
  );
};

export default BukuBesar;
