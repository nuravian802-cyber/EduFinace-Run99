import React, { useState } from 'react';
import { Plus, ArrowUpCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

const Pengeluaran: React.FC = () => {
  const { akunKas, kategori, catatPengeluaran } = useStore();
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    akunId: '',
    kategoriId: '',
    nominal: '',
    keterangan: ''
  });

  const pengeluaranKategori = kategori.filter(k => k.tipe === 'Pengeluaran');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    catatPengeluaran({
      tanggal: formData.tanggal,
      akunId: formData.akunId,
      kategoriId: formData.kategoriId,
      nominal: Number(formData.nominal),
      keterangan: formData.keterangan
    });
    alert('Pengeluaran berhasil dicatat!');
    setFormData({ ...formData, nominal: '', keterangan: '' });
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Pencatatan Pengeluaran</h2>
        <p>Catat arus keluar kas untuk operasional, gaji, dan belanja barang.</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <ArrowUpCircle size={28} className="text-danger" />
          <h3 style={{ margin: 0 }}>Form Pengeluaran</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tanggal Transaksi</label>
            <input type="date" className="form-control" value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} required />
          </div>

          <div className="form-group">
            <label className="form-label">Keluar dari Akun Kas</label>
            <select className="form-control" value={formData.akunId} onChange={(e) => setFormData({...formData, akunId: e.target.value})} required>
              <option value="">-- Pilih Akun --</option>
              {akunKas.map(a => (
                <option key={a.id} value={a.id}>{a.kode} - {a.nama} (Rp {a.saldo.toLocaleString('id-ID')})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Pos Pengeluaran</label>
            <select className="form-control" value={formData.kategoriId} onChange={(e) => setFormData({...formData, kategoriId: e.target.value})} required>
              <option value="">-- Pilih Pos Kategori --</option>
              {pengeluaranKategori.map(k => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Nominal (Rp)</label>
            <input type="text" inputMode="numeric" className="form-control" placeholder="0" value={formData.nominal ? Number(formData.nominal).toLocaleString('id-ID') : ''} onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); setFormData({...formData, nominal: val ? Number(val) : ''}) }} required />
          </div>

          <div className="form-group">
            <label className="form-label">Keterangan / Tujuan</label>
            <textarea className="form-control" rows={3} placeholder="Contoh: Pembelian alat tulis kantor..." value={formData.keterangan} onChange={(e) => setFormData({...formData, keterangan: e.target.value})}></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-danger">
              <Plus size={18} /> Simpan Pengeluaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Pengeluaran;
