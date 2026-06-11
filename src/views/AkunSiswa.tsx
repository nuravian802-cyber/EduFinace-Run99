import React, { useState } from 'react';
import { Search, KeyRound } from 'lucide-react';
import { useStore, type Siswa } from '../store/useStore';
import Modal from '../components/Modal';

const AkunSiswa: React.FC = () => {
  const { siswa, editSiswa } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSiswaData, setEditSiswaData] = useState<Siswa | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const filteredSiswa = siswa.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nis.includes(searchTerm)
  );

  const openResetModal = (s: Siswa) => {
    setEditSiswaData(s);
    setNewPassword('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editSiswaData) {
      editSiswa(editSiswaData.id, { password: newPassword });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Akun Siswa</h2>
          <p>Pantau kredensial dan reset password login siswa.</p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Cari nama atau NIS siswa..." 
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>NIS</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Nama Siswa</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Kelas</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Status Akun</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSiswa.map((s) => {
                const hasPassword = s.password && s.password.trim() !== '';
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{s.nis}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>{s.nama}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>{s.kelas}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      {hasPassword ? (
                        <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.85rem' }}>Aktif</span>
                      ) : (
                        <span style={{ color: 'var(--danger)', fontWeight: 600, fontSize: '0.85rem' }}>Belum Diset</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                      <button className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', color: 'var(--primary)', borderColor: 'var(--primary)' }} onClick={() => openResetModal(s)}>
                        <KeyRound size={16} style={{ marginRight: '0.25rem', display: 'inline' }} />
                        Reset Sandi
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredSiswa.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Data siswa tidak ditemukan.
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
        title="Reset Password Siswa"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Siswa Terpilih:</p>
            <h4 style={{ margin: '0 0 0.25rem 0' }}>{editSiswaData?.nama}</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>NIS: {editSiswaData?.nis}</p>
          </div>
          
          <div className="form-group">
            <label className="form-label">Password Baru</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Masukkan password baru..." 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
              Beri tahu siswa mengenai password barunya setelah direset.
            </small>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Batal</button>
            <button type="submit" className="btn btn-primary">Simpan Password</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AkunSiswa;
