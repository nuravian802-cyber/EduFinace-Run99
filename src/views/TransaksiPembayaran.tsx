import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Search, CheckCircle, Printer } from 'lucide-react';

const TransaksiPembayaran: React.FC = () => {
  const { tagihan, siswa, akunKas, bayarMultiTagihan, profilSekolah } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSiswaId, setSelectedSiswaId] = useState<string | null>(null);
  
  const [bayarForm, setBayarForm] = useState({
    akunId: '',
    tanggal: new Date().toISOString().split('T')[0]
  });

  const [metodeBayar, setMetodeBayar] = useState<'tunai' | 'transfer'>('tunai');
  const [uangDiterima, setUangDiterima] = useState<string>('');
  const [discounts, setDiscounts] = useState<{ amount: string; description: string }[]>([]);

  // Keep track of which tagihan are selected to be paid, and the amount to pay for each
  const [selectedTagihan, setSelectedTagihan] = useState<Record<string, number>>({});

  // Get all students who have at least one unpaid tagihan
  const pendingSiswaIds = Array.from(new Set(tagihan.filter(t => t.nominal - t.terbayar > 0).map(t => t.siswaId)));
  const siswaWithPending = siswa.filter(s => pendingSiswaIds.includes(s.id));

  // Filter students based on search
  const filteredSiswa = siswaWithPending.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nis.includes(searchTerm)
  );

  const selectedSiswa = siswa.find(s => s.id === selectedSiswaId);
  const pendingTagihanForSiswa = tagihan.filter(t => t.siswaId === selectedSiswaId && (t.nominal - t.terbayar > 0));

  const handleSiswaClick = (id: string) => {
    setSelectedSiswaId(id);
    setSelectedTagihan({}); // Reset selection when changing student
    setUangDiterima('');
    setDiscounts([]);
  };



  const handleCheckboxChange = (tId: string, sisa: number, checked: boolean) => {
    if (checked) {
      setSelectedTagihan(prev => ({ ...prev, [tId]: sisa }));
    } else {
      const newSel = { ...selectedTagihan };
      delete newSel[tId];
      setSelectedTagihan(newSel);
    }
  };

  const handleNominalChange = (tId: string, value: string, max: number) => {
    let num = Number(value.replace(/\D/g, ''));
    if (num > max) num = max;
    if (num < 0) num = 0;
    setSelectedTagihan(prev => ({ ...prev, [tId]: num }));
  };

  const totalBayar = Object.values(selectedTagihan).reduce((sum, val) => sum + val, 0);
  const parsedDiskon = discounts.reduce((sum, d) => sum + Number((d.amount || '').replace(/\D/g, '')), 0);
  const keteranganDiskonCombined = discounts.filter(d => Number((d.amount || '').replace(/\D/g, '')) > 0 && (d.description || '').trim() !== '')
    .map(d => `${d.description} (Rp ${Number((d.amount || '').replace(/\D/g, '')).toLocaleString('id-ID')})`).join(', ');
  const totalHarusDibayar = Math.max(0, totalBayar - parsedDiskon);
  
  const parsedUangDiterima = Number(uangDiterima.replace(/\D/g, ''));
  const uangKembali = metodeBayar === 'tunai' ? parsedUangDiterima - totalHarusDibayar : 0;

  const isLunas = pendingTagihanForSiswa.length > 0 && pendingTagihanForSiswa.every(t => {
    const sisa = t.nominal - t.terbayar;
    const dibayar = selectedTagihan[t.id] || 0;
    return sisa - dibayar <= 0;
  });

  const handleBayar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswaId || !bayarForm.akunId || Object.keys(selectedTagihan).length === 0) return;
    
    if (metodeBayar === 'tunai' && parsedUangDiterima < totalHarusDibayar) {
      alert('Jumlah uang yang diterima kurang dari total yang harus dibayar!');
      return;
    }

    // Format payload
    const pembayaran = Object.entries(selectedTagihan).map(([tId, nominal]) => ({ tagihanId: tId, nominal }));
    
    bayarMultiTagihan(pembayaran, bayarForm.akunId, bayarForm.tanggal, parsedDiskon, keteranganDiskonCombined);
    alert('Pembayaran berhasil dicatat!');
    setSelectedTagihan({});
    setUangDiterima('');
    setDiscounts([]);
    if (pendingTagihanForSiswa.length === pembayaran.length) {
      // If all pending were paid, deselect student
      setSelectedSiswaId(null);
    }
  };

  return (
    <>
      <div className="animate-fade-in no-print">
      <div className="page-header">
        <div>
          <h2>Transaksi Pembayaran Siswa</h2>
          <p>Pilih siswa lalu centang satu atau lebih tagihan yang ingin dibayar sekaligus.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Pilih Siswa (Ada Tagihan)</h3>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Cari siswa..." 
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {filteredSiswa.map((s) => {
              const count = tagihan.filter(t => t.siswaId === s.id && t.nominal - t.terbayar > 0).length;
              return (
                <div key={s.id} style={{ 
                  padding: '1rem', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-md)', 
                  marginBottom: '1rem',
                  cursor: 'pointer',
                  backgroundColor: selectedSiswaId === s.id ? '#eff6ff' : 'white',
                  borderColor: selectedSiswaId === s.id ? 'var(--primary)' : 'var(--border-color)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onClick={() => handleSiswaClick(s.id)}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{s.nama}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>NIS: {s.nis}</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {count} tagihan
                  </div>
                </div>
              );
            })}
            {filteredSiswa.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                Tidak ada tagihan yang belum lunas.
              </p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Keranjang Pembayaran</h3>
          
          {!selectedSiswaId ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle size={48} style={{ margin: '0 auto 1rem', color: 'var(--border-color)' }} />
              <p>Silakan pilih siswa dari daftar di samping kiri.</p>
            </div>
          ) : (
            <form onSubmit={handleBayar} className="animate-fade-in">
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Siswa Terpilih:</p>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{selectedSiswa?.nama} ({selectedSiswa?.kelas})</h4>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Tagihan:</p>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Rp {totalBayar.toLocaleString('id-ID')}</span>
                  </div>
                  {parsedDiskon > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem', color: 'var(--danger)' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem' }}>Diskon/Voucher:</p>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>- Rp {parsedDiskon.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.25rem' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Harus Dibayar:</p>
                    <h3 style={{ margin: 0, color: 'var(--primary)' }}>Rp {totalHarusDibayar.toLocaleString('id-ID')}</h3>
                  </div>
                </div>
              </div>

              <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                      <th style={{ padding: '0.75rem 0.5rem', width: '40px' }}>
                        <input 
                          type="checkbox" 
                          title="Pilih Semua Tagihan"
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          checked={pendingTagihanForSiswa.length > 0 && Object.keys(selectedTagihan).length === pendingTagihanForSiswa.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const allSelected: Record<string, number> = {};
                              pendingTagihanForSiswa.forEach(t => {
                                allSelected[t.id] = t.nominal - t.terbayar;
                              });
                              setSelectedTagihan(allSelected);
                            } else {
                              setSelectedTagihan({});
                            }
                          }}
                        />
                      </th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Nama Tagihan</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Sisa Kekurangan</th>
                      <th style={{ padding: '0.75rem 0.5rem', width: '150px' }}>Bayar (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingTagihanForSiswa.map(t => {
                      const sisa = t.nominal - t.terbayar;
                      const isSelected = selectedTagihan[t.id] !== undefined;
                      return (
                        <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: isSelected ? '#fafafa' : 'white' }}>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <input 
                              type="checkbox" 
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                              checked={isSelected}
                              onChange={(e) => handleCheckboxChange(t.id, sisa, e.target.checked)}
                            />
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <div style={{ fontWeight: 600 }}>{t.namaTagihan}</div>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', color: 'var(--danger)', fontWeight: 600 }}>
                            {sisa.toLocaleString('id-ID')}
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <input 
                              type="text" 
                              inputMode="numeric"
                              className="form-control" 
                              style={{ padding: '0.4rem' }}
                              value={selectedTagihan[t.id] ? Number(selectedTagihan[t.id]).toLocaleString('id-ID') : ''} 
                              disabled={!isSelected}
                              onChange={(e) => handleNominalChange(t.id, e.target.value, sisa)} 
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Tanggal Transaksi</label>
                  <input type="date" className="form-control" value={bayarForm.tanggal} onChange={e => setBayarForm({...bayarForm, tanggal: e.target.value})} required />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Pilih Akun Kas</label>
                  <select className="form-control" value={bayarForm.akunId} onChange={e => setBayarForm({...bayarForm, akunId: e.target.value})} required>
                    <option value="">-- Pilih Akun Penerima --</option>
                    {akunKas.map(a => <option key={a.id} value={a.id}>{a.kode} - {a.nama}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Diskon / Voucher (Opsional)</label>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }} onClick={() => setDiscounts([...discounts, { amount: '', description: '' }])}>+ Tambah Diskon</button>
                </div>
                
                {discounts.length === 0 && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>Tidak ada diskon yang ditambahkan.</p>
                )}
                
                {discounts.map((d, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: idx === discounts.length - 1 ? 0 : '1rem', alignItems: 'flex-start' }}>
                    <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                      <input 
                        type="text" 
                        inputMode="numeric"
                        className="form-control" 
                        value={d.amount} 
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '');
                          const newAmount = val ? Number(val).toLocaleString('id-ID') : '';
                          const newDiscounts = [...discounts];
                          newDiscounts[idx] = { ...newDiscounts[idx], amount: newAmount };
                          setDiscounts(newDiscounts);
                        }} 
                        placeholder="Nominal (Rp)"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0, flex: 2 }}>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={d.description} 
                        onChange={e => {
                          const newDiscounts = [...discounts];
                          newDiscounts[idx] = { ...newDiscounts[idx], description: e.target.value };
                          setDiscounts(newDiscounts);
                        }} 
                        placeholder="Keterangan (misal: Beasiswa)"
                      />
                    </div>
                    <button type="button" className="btn btn-danger" style={{ padding: '0.55rem 0.75rem' }} onClick={() => {
                      const newDiscounts = [...discounts];
                      newDiscounts.splice(idx, 1);
                      setDiscounts(newDiscounts);
                    }}>✕</button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginTop: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Metode Pembayaran</label>
                  <select className="form-control" value={metodeBayar} onChange={e => setMetodeBayar(e.target.value as 'tunai' | 'transfer')} required>
                    <option value="tunai">Tunai</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>

                {metodeBayar === 'tunai' && totalHarusDibayar > 0 && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Uang Diterima (Rp)</label>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      className="form-control" 
                      value={uangDiterima} 
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        setUangDiterima(val ? Number(val).toLocaleString('id-ID') : '');
                      }} 
                      placeholder="Masukkan nominal uang"
                      required
                    />
                  </div>
                )}
              </div>

              {metodeBayar === 'tunai' && uangDiterima && totalHarusDibayar > 0 && (
                <div style={{ backgroundColor: uangKembali < 0 ? '#fee2e2' : '#dcfce7', padding: '1rem', borderRadius: 'var(--radius-md)', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${uangKembali < 0 ? '#fca5a5' : '#86efac'}` }}>
                  <div style={{ fontWeight: 600, color: uangKembali < 0 ? '#991b1b' : '#166534' }}>
                    {uangKembali < 0 ? 'Kekurangan:' : 'Kembali:'}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: uangKembali < 0 ? '#991b1b' : '#166534' }}>
                    Rp {Math.abs(uangKembali).toLocaleString('id-ID')}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }} onClick={() => window.print()} disabled={Object.keys(selectedTagihan).length === 0}>
                  <Printer size={18} style={{ marginRight: '0.5rem' }} /> Cetak Nota
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '1rem', fontSize: '1.1rem' }} disabled={Object.keys(selectedTagihan).length === 0}>
                  Proses {Object.keys(selectedTagihan).length} Pembayaran
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      </div>

      {/* Printable Receipt */}
      <style>
        {`
          .print-receipt {
            font-family: 'F25 Bank Printer', monospace !important;
          }
          @media print {
            @page {
              size: 21.5cm 33cm; /* F4 size */
              margin: 0.5cm;
            }
            .print-receipt {
              font-size: 0.85rem !important;
            }
            .print-receipt h2 {
              font-size: 1.25rem !important;
            }
            .print-receipt h3 {
              font-size: 1rem !important;
            }
            .print-receipt p, .print-receipt td, .print-receipt th {
              font-size: 0.85rem !important;
            }
          }
        `}
      </style>
      <div className="print-area print-receipt" style={{ padding: '1rem', backgroundColor: 'white', color: 'black', position: 'relative' }}>
        {/* Watermark Lunas */}
        {isLunas && (
          <div style={{
            position: 'absolute',
            top: '10cm',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            opacity: 0.15
          }}>
            <img src="/lunas.png" alt="LUNAS" style={{ width: '9.89cm', height: '7cm', objectFit: 'contain' }} />
          </div>
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid black', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ margin: 0, textTransform: 'uppercase', color: 'black' }}>{profilSekolah.nama}</h2>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>{profilSekolah.alamat}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ margin: 0, color: '#475569' }}>BUKTI PEMBAYARAN</h3>
          </div>
        </div>
        
        <div style={{ marginBottom: '2rem', color: 'black' }}>
          <p style={{ color: 'black' }}><strong>Tanggal:</strong> {new Date().toLocaleDateString('id-ID')}</p>
          <p style={{ color: 'black' }}><strong>Siswa:</strong> {selectedSiswa?.nama} (NIS: {selectedSiswa?.nis})</p>
          <p style={{ color: 'black' }}><strong>Kelas:</strong> {selectedSiswa?.kelas}</p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', color: 'black' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid black' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Deskripsi</th>
              <th style={{ textAlign: 'right', padding: '0.5rem' }}>Nominal</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(selectedTagihan).map(([tId, nominal]) => {
              const t = pendingTagihanForSiswa.find(x => x.id?.toString() === tId);
              return (
                <tr key={tId}>
                  <td style={{ padding: '0.5rem' }}>Pembayaran {t?.namaTagihan}</td>
                  <td style={{ textAlign: 'right', padding: '0.5rem' }}>Rp {nominal.toLocaleString('id-ID')}</td>
                </tr>
              );
            })}
            {parsedDiskon > 0 && (
              <tr>
                <td style={{ padding: '0.5rem', color: '#dc2626' }}>
                  Diskon/Voucher {keteranganDiskonCombined && <span style={{ fontSize: '0.75rem', fontStyle: 'italic', display: 'block' }}>({keteranganDiskonCombined})</span>}
                </td>
                <td style={{ textAlign: 'right', padding: '0.5rem', color: '#dc2626' }}>- Rp {parsedDiskon.toLocaleString('id-ID')}</td>
              </tr>
            )}
            <tr style={{ borderTop: '1px solid black', fontWeight: 'bold' }}>
              <td style={{ padding: '0.5rem' }}>TOTAL DIBAYAR</td>
              <td style={{ textAlign: 'right', padding: '0.5rem' }}>Rp {totalHarusDibayar.toLocaleString('id-ID')}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4rem', color: 'black' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'black' }}>Penerima / Admin</p>
            <br /><br /><br />
          </div>
        </div>

        <div style={{ marginTop: '2rem', fontStyle: 'italic', fontSize: '0.85rem', color: 'black' }}>
          * Bukti Pembayaran ini jangan sampai hilang
        </div>
        </div>
      </div>
    </>
  );
};

export default TransaksiPembayaran;
