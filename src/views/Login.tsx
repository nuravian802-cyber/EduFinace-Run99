import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { KeyRound, User, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const { admin, siswa, login } = useStore();
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
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'var(--primary)', 
            color: 'white', 
            width: '60px', 
            height: '60px', 
            borderRadius: '16px',
            marginBottom: '1rem'
          }}>
            <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>EF</h2>
          </div>
          <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>EduFinance</h2>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Sistem Informasi Keuangan Sekolah</p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            color: 'var(--danger)', 
            padding: '0.75rem 1rem', 
            borderRadius: '8px', 
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            fontWeight: 500
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} /> Username / NIS
            </label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Masukkan username admin atau NIS siswa"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ padding: '0.8rem 1rem' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={16} /> Password
            </label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: '0.8rem 1rem' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}>
            <KeyRound size={18} /> Masuk ke Sistem
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          &copy; 2026 EduFinance. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
