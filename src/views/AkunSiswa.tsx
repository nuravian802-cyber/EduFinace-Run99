import React, { useState } from 'react';
import { Search, KeyRound, Eye, EyeOff, Upload } from 'lucide-react';
import { useStore, type Siswa } from '../store/useStore';
import Modal from '../components/Modal';
import { importFromExcel } from '../utils/excel';

const AkunSiswa: React.FC = () => {
  const { siswa, editSiswa, addSiswa } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSiswaData, setEditSiswaData] = useState<Siswa | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const activeSiswa = siswa.filter(s => s.status !== 'Non-aktif');
  
  const filteredSiswa = activeSiswa.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nis.includes(searchTerm)
  );

  const openResetModal = (s: Siswa) => {
    setEditSiswaData(s);
    setNewPassword('');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editSiswaData) {
      editSiswa(editSiswaData.id, { password: newPassword });
    }
    setIsModalOpen(false);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importFromExcel(file);
      let newCount = 0;
      let updateCount = 0;
      
      data.forEach(row => {
        // Normalize keys to lowercase and remove all spaces
        const normalizedRow: any = {};
        for (const key in row) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            normalizedRow[key.toString().replace(/\s+/g, '').toLowerCase()] = row[key];
          }
        }

        const nis = (normalizedRow['nis'] || normalizedRow['nomorinduksiswa'] || '')?.toString();
        const nama = (normalizedRow['nama'] || normalizedRow['namasiswa'] || normalizedRow['namalengkap'])?.toString();
        // Fallback: jika tidak ada kolom sandi, gunakan NIS sebagai default password
        const password = (normalizedRow['password'] || normalizedRow['sandi'] || normalizedRow['katasandi'] || normalizedRow['pin'] || nis)?.toString().trim();
        
        if (nis && nama) {
          const existingSiswa = siswa.find(s => s.nis === nis);
          if (existingSiswa) {
            if (password) {
              editSiswa(existingSiswa.id, { password });
              updateCount++;
            }
          } else {
            addSiswa({
              nis,
              nama,
              kelas: (normalizedRow['kelas'] || '')?.toString(),
              tanggalLahir: (normalizedRow['tanggallahir'] || normalizedRow['tgllahir'] || normalizedRow['lahir'] || '')?.toString(),
              namaOrangTua: (normalizedRow['namaortu'] || normalizedRow['namawali'] || normalizedRow['namaorangtua'] || normalizedRow['ortu'] || '')?.toString(),
              waOrangTua: (normalizedRow['nowaortu'] || normalizedRow['waortu'] || normalizedRow['nowa'] || normalizedRow['wa'] || normalizedRow['nohportu'] || normalizedRow['nohp'] || normalizedRow['hp'] || normalizedRow['telepon'] || normalizedRow['notelp'] || '')?.toString(),
              password: password || ''
            });
            newCount++;
          }
        }
      });
      setTimeout(() => {
        let msg = `Sukses membaca file Excel! `;
        if (newCount > 0) msg += `\n- ${newCount} Akun Siswa Baru Berhasil Dibuat.`;
        if (updateCount > 0) msg += `\n- ${updateCount} Sandi Akun Berhasil Diaktifkan/Diperbarui (Sandi default: NIS jika kolom sandi kosong).`;
        if (newCount === 0 && updateCount === 0) msg += `\nTidak ada data valid yang ditemukan atau semua siswa sudah ada tanpa perubahan sandi.`;
        
        alert(msg);
      }, 100);
    } catch (err) {
      alert('Gagal membaca file Excel. Pastikan format sesuai.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Akun Siswa</h2>
          <p>Pantau kredensial dan reset password login siswa.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileChange} 
          />
          <button className="btn btn-outline" style={{ color: 'var(--success)', borderColor: 'var(--success)' }} onClick={handleImportClick}>
            <Upload size={18} /> Impor Data & Sandi
          </button>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>NIS: {editSiswaData?.nis}</p>
              {editSiswaData?.password && editSiswaData.password.trim() !== '' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#e2e8f0', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                  <KeyRound size={14} color="#64748b" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Sandi Saat Ini: {editSiswaData.password}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Password Baru</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control" 
                placeholder="Masukkan password baru..." 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                style={{ paddingRight: '2.5rem' }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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
