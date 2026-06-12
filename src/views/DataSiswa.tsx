import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Upload } from 'lucide-react';
import { useStore, type Siswa } from '../store/useStore';
import Modal from '../components/Modal';
import { importFromExcel } from '../utils/excel';

const DataSiswa: React.FC = () => {
  const { siswa, deleteSiswa, addSiswa, editSiswa, toggleStatusSiswa } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editId, setEditId] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Siswa>>({
    nis: '',
    nisn: '',
    password: '',
    nama: '',
    kelas: '',
    tanggalLahir: '',
    namaOrangTua: '',
    waOrangTua: ''
  });

  const filteredSiswa = siswa.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nis.includes(searchTerm)
  );

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ nis: '', nisn: '', password: '', nama: '', kelas: '', tanggalLahir: '', namaOrangTua: '', waOrangTua: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (s: Siswa) => {
    setModalMode('edit');
    setEditId(s.id);
    setFormData({ ...s });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      addSiswa(formData as Omit<Siswa, 'id'>);
    } else if (modalMode === 'edit' && editId) {
      editSiswa(editId, formData);
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
      let count = 0;
      data.forEach(row => {
        // Normalize keys to lowercase and remove all spaces
        const normalizedRow: any = {};
        for (const key in row) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            normalizedRow[key.toString().replace(/\s+/g, '').toLowerCase()] = row[key];
          }
        }

        const nama = normalizedRow['nama'] || normalizedRow['namasiswa'] || normalizedRow['namalengkap'];
        if (nama) {
          addSiswa({
            nis: (normalizedRow['nis'] || normalizedRow['nomorinduksiswa'] || '')?.toString(),
            nama: nama?.toString(),
            kelas: (normalizedRow['kelas'] || '')?.toString(),
            tanggalLahir: (normalizedRow['tanggallahir'] || normalizedRow['tgllahir'] || normalizedRow['lahir'] || '')?.toString(),
            namaOrangTua: (normalizedRow['namaortu'] || normalizedRow['namawali'] || normalizedRow['namaorangtua'] || normalizedRow['ortu'] || '')?.toString(),
            waOrangTua: (normalizedRow['nowaortu'] || normalizedRow['waortu'] || normalizedRow['nowa'] || normalizedRow['wa'] || normalizedRow['nohportu'] || normalizedRow['nohp'] || normalizedRow['hp'] || normalizedRow['telepon'] || normalizedRow['notelp'] || '')?.toString(),
            password: ''
          });
          count++;
        }
      });
      alert(`Berhasil mengimpor ${count} data siswa dari Excel.`);
    } catch (err) {
      alert('Gagal membaca file Excel.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Data Siswa</h2>
          <p>Kelola direktori siswa aktif, NISN, dan kontak orang tua.</p>
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
            <Upload size={18} /> Impor Excel
          </button>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Tambah Data
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
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>NIS</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nama Siswa</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kelas</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tanggal Lahir</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nama Wali</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>No WA Ortu</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSiswa.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)', opacity: s.status === 'Non-aktif' ? 0.6 : 1 }}>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{s.nis}</td>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{s.nama}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{s.kelas}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{s.tanggalLahir || '-'}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{s.namaOrangTua}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{s.waOrangTua}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      fontWeight: 600, 
                      backgroundColor: s.status === 'Non-aktif' ? '#f1f5f9' : '#dcfce7', 
                      color: s.status === 'Non-aktif' ? '#64748b' : '#16a34a',
                      whiteSpace: 'nowrap'
                    }}>
                      {s.status === 'Non-aktif' ? 'Lulus' : 'Aktif'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.25rem', alignItems: 'center' }}>
                    <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px', marginRight: '0.5rem', cursor: 'pointer', flexShrink: 0 }} title={s.status === 'Non-aktif' ? 'Aktifkan Siswa' : 'Set Lulus Siswa'}>
                      <input 
                        type="checkbox" 
                        checked={s.status !== 'Non-aktif'} 
                        onChange={() => toggleStatusSiswa(s.id)} 
                        style={{ opacity: 0, width: 0, height: 0 }} 
                      />
                      <span style={{ 
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                        backgroundColor: s.status === 'Non-aktif' ? '#cbd5e1' : '#10b981', 
                        transition: '.4s', borderRadius: '34px' 
                      }}>
                        <span style={{ 
                          position: 'absolute', content: '""', height: '14px', width: '14px', 
                          left: s.status === 'Non-aktif' ? '3px' : '19px', bottom: '3px', 
                          backgroundColor: 'white', transition: '.4s', borderRadius: '50%' 
                        }}></span>
                      </span>
                    </label>
                    <button className="btn" style={{ padding: '0.4rem', color: 'var(--primary)' }} onClick={() => openEditModal(s)}><Edit size={16} /></button>
                    <button className="btn" style={{ padding: '0.4rem', color: 'var(--danger)' }} onClick={() => { if(confirm('Hapus siswa ini?')) deleteSiswa(s.id); }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {filteredSiswa.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
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
        title={modalMode === 'add' ? 'Tambah Siswa' : 'Edit Siswa'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">NIS</label>
            <input type="text" className="form-control" value={formData.nis} onChange={(e) => setFormData({...formData, nis: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input type="text" className="form-control" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Kelas</label>
            <input type="text" className="form-control" value={formData.kelas} onChange={(e) => setFormData({...formData, kelas: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Tanggal Lahir</label>
            <input type="date" className="form-control" value={formData.tanggalLahir || ''} onChange={(e) => setFormData({...formData, tanggalLahir: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Nama Wali</label>
            <input type="text" className="form-control" value={formData.namaOrangTua} onChange={(e) => setFormData({...formData, namaOrangTua: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">No. WA Ortu</label>
            <input type="tel" className="form-control" value={formData.waOrangTua} onChange={(e) => setFormData({...formData, waOrangTua: e.target.value})} required />
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Batal</button>
            <button type="submit" className="btn btn-primary">{modalMode === 'add' ? 'Simpan' : 'Perbarui'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DataSiswa;
