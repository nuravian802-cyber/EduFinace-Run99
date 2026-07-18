import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const Pengaturan: React.FC = () => {
  const navigate = useNavigate();
  const { profilSekolah, updateProfil, riwayatLogin } = useStore();
  
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
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Riwayat User Login</h3>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Daftar riwayat aktivitas login pengguna terbaru:
          </p>

          <div className="table-responsive">
            <table className="table" style={{ width: '100%', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '0.75rem 0' }}>Waktu</th>
                  <th style={{ padding: '0.75rem 0' }}>Pengguna</th>
                  <th style={{ padding: '0.75rem 0' }}>Role</th>
                  <th style={{ padding: '0.75rem 0' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {riwayatLogin.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '1rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada riwayat login.</td>
                  </tr>
                ) : (
                  riwayatLogin.map((riwayat, index) => (
                    <tr key={riwayat.id || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 0' }}>
                        {riwayat.created_at ? (
                          <>
                            {new Date(riwayat.created_at).toLocaleDateString('id-ID')} {new Date(riwayat.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </>
                        ) : '-'}
                      </td>
                      <td style={{ padding: '0.75rem 0', fontWeight: 500 }}>{riwayat.pengguna}</td>
                      <td style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>{riwayat.role}</td>
                      <td style={{ padding: '0.75rem 0' }}>
                        <span style={{ 
                          backgroundColor: riwayat.status === 'Berhasil' ? '#dcfce7' : '#fee2e2', 
                          color: riwayat.status === 'Berhasil' ? '#166534' : '#991b1b', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '9999px', 
                          fontSize: '0.75rem', 
                          fontWeight: 600 
                        }}>
                          {riwayat.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengaturan;
