import React, { useState, useMemo } from 'react';
import { Search, Edit, Trash2, History } from 'lucide-react';
import { useStore, type Transaksi } from '../store/useStore';
import Modal from '../components/Modal';

const RiwayatTransaksi: React.FC = () => {
  const { transaksi, akunKas, kategori, deleteTransaksi, editTransaksi } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [bulan, setBulan] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Transaksi>>({});

  const filteredTransaksi = useMemo(() => {
    return transaksi
      .filter(t => t.tanggal.startsWith(bulan) && (t.keterangan.toLowerCase().includes(searchTerm.toLowerCase())))
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [transaksi, bulan, searchTerm]);

  const openEditModal = (t: Transaksi) => {
    setEditId(t.id);
    setFormData({ ...t });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      editTransaksi(editId, formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (t: Transaksi) => {
    if (window.confirm(`Yakin ingin menghapus transaksi "${t.keterangan}" sejumlah Rp ${t.nominal.toLocaleString('id-ID')}?\n\nSaldo kas akan disesuaikan kembali.`)) {
      deleteTransaksi(t.id);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Riwayat Transaksi</h2>
          <p>Melihat, mengedit, atau membatalkan transaksi yang telah tercatat.</p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Cari keterangan transaksi..." 
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ width: '200px' }}>
            <input type="month" className="form-control" value={bulan} onChange={(e) => setBulan(e.target.value)} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Tanggal</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Tipe</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Keterangan</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Akun Kas</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Nominal (Rp)</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransaksi.map((t) => {
                const akun = akunKas.find(a => a.id === t.akunId);
                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 0.5rem' }}>{new Date(t.tanggal).toLocaleDateString('id-ID')}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '50px', 
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        backgroundColor: t.tipe === 'Pemasukan' ? '#d1fae5' : '#fee2e2',
                        color: t.tipe === 'Pemasukan' ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {t.tipe}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{t.keterangan}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>{akun ? akun.nama : '-'}</td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right', fontWeight: 600 }}>
                      {t.nominal.toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                      <button className="btn" style={{ padding: '0.4rem', color: 'var(--primary)' }} onClick={() => openEditModal(t)} title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="btn" style={{ padding: '0.4rem', color: 'var(--danger)' }} onClick={() => handleDelete(t)} title="Hapus">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredTransaksi.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Tidak ada transaksi yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Edit Transaksi"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tanggal</label>
            <input type="date" className="form-control" value={formData.tanggal || ''} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Keterangan</label>
            <input type="text" className="form-control" value={formData.keterangan || ''} onChange={(e) => setFormData({...formData, keterangan: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Akun Kas</label>
            <select className="form-control" value={formData.akunId || ''} onChange={(e) => setFormData({...formData, akunId: e.target.value})} required>
              <option value="">-- Pilih Akun Kas --</option>
              {akunKas.map(a => (
                <option key={a.id} value={a.id}>{a.kode} - {a.nama} (Saldo: Rp {a.saldo.toLocaleString('id-ID')})</option>
              ))}
            </select>
          </div>

          {!formData.tagihanId && (
            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select className="form-control" value={formData.kategoriId || ''} onChange={(e) => setFormData({...formData, kategoriId: e.target.value})} required>
                <option value="">-- Pilih Kategori --</option>
                {kategori.filter(k => k.tipe === formData.tipe).map(k => (
                  <option key={k.id} value={k.id}>{k.nama}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Nominal (Rp)</label>
            <input type="number" className="form-control" value={formData.nominal || 0} onChange={(e) => setFormData({...formData, nominal: Number(e.target.value)})} required min="1" />
          </div>
          
          <div className="modal-footer" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Batal</button>
            <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RiwayatTransaksi;
