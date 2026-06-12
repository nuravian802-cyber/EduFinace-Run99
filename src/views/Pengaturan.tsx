import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const Pengaturan: React.FC = () => {
  const navigate = useNavigate();
  const { profilSekolah, updateProfil } = useStore();
  
  const [formData, setFormData] = useState({
    nama: profilSekolah.nama,
    alamat: profilSekolah.alamat,
    npsn: profilSekolah.npsn
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateProfil(formData);
    alert('Profil sekolah berhasil disimpan!');
  };
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Pengaturan Sistem</h2>
        <p>Kelola profil sekolah dan manajemen hak akses pengguna.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Profil Sekolah</h3>
          
          <div className="form-group">
            <label className="form-label">Nama Institusi</label>
            <input type="text" name="nama" className="form-control" value={formData.nama} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label className="form-label">Alamat</label>
            <textarea name="alamat" className="form-control" rows={3} value={formData.alamat} onChange={handleChange}></textarea>
          </div>
          
          <div className="form-group">
            <label className="form-label">NPSN / Izin Operasional</label>
            <input type="text" name="npsn" className="form-control" value={formData.npsn} onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={18} /> Simpan Profil
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Manajemen Pengguna (Roles)</h3>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Daftar peran yang tersedia dalam sistem EduFinance:
          </p>

          <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Admin</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Akses penuh (Read/Write/Delete) ke seluruh modul termasuk Pengaturan Sistem, Master Data, Transaksi, dan Reporting.</p>
          </div>

          <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Kepala Sekolah (Principal)</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Akses level eksekutif. Hanya dapat melihat (Read-Only) modul Dashboard dan Reporting.</p>
          </div>

          <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Siswa</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Akses khusus untuk siswa agar bisa login dan hanya melihat tagihan/pembayaran mereka sendiri.</p>
          </div>

          <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => navigate('/sistem/staf-admin')}>
            Kelola Akun Pengguna
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pengaturan;
