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

  const filteredSiswa = siswa.filter(s => 
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
        const nis = (row['NIS'] || row['nis'] || '')?.toString();
        const nama = (row['Nama'] || row['NAMA'] || row['nama'])?.toString();
        const password = (row['Password'] || row['password'] || row['Sandi'] || '')?.toString();
        
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
              nisn: (row['NISN'] || row['nisn'] || '')?.toString(),
              nama,
              kelas: (row['Kelas'] || row['kelas'] || '')?.toString(),
              tanggalLahir: (row['TanggalLahir'] || row['Tanggal Lahir'] || '')?.toString(),
              namaOrangTua: (row['NamaOrtu'] || row['Nama Wali'] || row['Nama Orang Tua'] || '')?.toString(),
              waOrangTua: (row['WaOrtu'] || row['No WA'] || row['No. WA'] || '')?.toString(),
              password: password || ''
            });
            newCount++;
          }
        }
      });
      alert(`Berhasil mengimpor: ${newCount} data siswa baru ditambahkan, ${updateCount} password akun diperbarui.`);
    } catch (err) {
      alert('Gagal membaca file Excel. Pastikan format sesuai.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
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
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>NIS: {editSiswaData?.nis}</p>
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
