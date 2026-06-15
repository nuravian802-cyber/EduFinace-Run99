import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { KeyRound, User, Lock, School } from 'lucide-react';

const Login: React.FC = () => {
  const { admin, siswa, login, profilSekolah } = useStore();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Cek di tabel Admin
    const adminUser = admin.find(a => a.username === username);
    if (adminUser) {
      if (adminUser.password === password) {
        login({
          id: adminUser.id,
          username: adminUser.username,
          nama: adminUser.nama,
          role: adminUser.role
        });
        navigate('/');
        return;
      }
    }

    // Cek di tabel Siswa (NIS sebagai username)
    const siswaUser = siswa.find(s => s.nis === username);
    if (siswaUser) {
      // Siswa harus sudah diset passwordnya oleh Admin
      if (siswaUser.password && siswaUser.password === password) {
        login({
          id: siswaUser.id,
          username: siswaUser.nis,
          nama: siswaUser.nama,
          role: 'Siswa'
        });
        navigate('/master/tagihan');
        return;
      } else if (!siswaUser.password) {
        setError('Akun Anda belum aktif. Hubungi Admin Sekolah untuk meminta password.');
        return;
      }
    }

    setError('Username/NIS atau Password salah.');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'var(--bg-body)',
      padding: '1rem'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '340px', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <img src="/logo.png?v=3" alt="Logo Sekolah" style={{ width: '70px', height: 'auto', marginBottom: '0.75rem' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ margin: '0', lineHeight: 1, fontSize: '2rem', fontWeight: 800, letterSpacing: '2px', color: '#1e3a8a' }}>SPADAH</h2>
              <div style={{ margin: '4px 0 0', fontWeight: 600, fontSize: '0.85rem', lineHeight: 1, color: '#1e3a8a', letterSpacing: '0.5px' }}>Integrated Finance</div>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            color: 'var(--danger)', 
            padding: '0.5rem 0.75rem', 
            borderRadius: '8px', 
            fontSize: '0.8rem',
            marginBottom: '1rem',
            fontWeight: 500
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <User size={14} /> Username / NIS
            </label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Masukkan username admin atau NIS"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Lock size={14} /> Password
            </label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.95rem' }}>
            <KeyRound size={16} /> Masuk ke Sistem
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem' }}>
          Copyright &copy; 2026 Vian.Hsy. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
