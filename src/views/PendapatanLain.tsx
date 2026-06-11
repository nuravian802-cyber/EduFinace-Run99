import React, { useState } from 'react';
import { Plus, ArrowDownCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

const PendapatanLain: React.FC = () => {
  const { akunKas, kategori, catatPendapatanLain } = useStore();
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    akunId: '',
    kategoriId: '',
    nominal: '',
    keterangan: ''
  });

  const pemasukanKategori = kategori.filter(k => k.tipe === 'Pemasukan');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    catatPendapatanLain({
      tanggal: formData.tanggal,
      akunId: formData.akunId,
      kategoriId: formData.kategoriId,
      nominal: Number(formData.nominal),
      keterangan: formData.keterangan
    });
    alert('Pendapatan berhasil dicatat!');
    setFormData({ ...formData, nominal: '', keterangan: '' });
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Penerimaan Pendapatan Lain</h2>
        <p>Catat pendapatan selain dari tagihan siswa (Donasi, Hibah, dll).</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <ArrowDownCircle size={28} className="text-success" />
          <h3 style={{ margin: 0 }}>Form Pemasukan</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tanggal Transaksi</label>
            <input type="date" className="form-control" value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} required />
          </div>

          <div className="form-group">
            <label className="form-label">Masuk ke Akun Kas</label>
            <select className="form-control" value={formData.akunId} onChange={(e) => setFormData({...formData, akunId: e.target.value})} required>
              <option value="">-- Pilih Akun --</option>
              {akunKas.map(a => (
                <option key={a.id} value={a.id}>{a.kode} - {a.nama} (Rp {a.saldo.toLocaleString('id-ID')})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Pos Pendapatan</label>
            <select className="form-control" value={formData.kategoriId} onChange={(e) => setFormData({...formData, kategoriId: e.target.value})} required>
              <option value="">-- Pilih Pos Kategori --</option>
              {pemasukanKategori.map(k => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Nominal (Rp)</label>
            <input type="number" className="form-control" placeholder="0" value={formData.nominal} onChange={(e) => setFormData({...formData, nominal: e.target.value})} required />
          </div>

          <div className="form-group">
            <label className="form-label">Keterangan Tambahan</label>
            <textarea className="form-control" rows={3} placeholder="Contoh: Donasi acara sekolah..." value={formData.keterangan} onChange={(e) => setFormData({...formData, keterangan: e.target.value})}></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary">
              <Plus size={18} /> Simpan Pendapatan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PendapatanLain;
