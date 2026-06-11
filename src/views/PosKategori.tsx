import React, { useState } from 'react';
import { Plus, Edit, Trash2, Download } from 'lucide-react';
import { useStore, type Kategori } from '../store/useStore';
import Modal from '../components/Modal';
import { exportToExcel } from '../utils/excel';

const PosKategori: React.FC = () => {
  const { kategori, addKategori, deleteKategori, editKategori } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editId, setEditId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Kategori>>({
    tipe: 'Pemasukan',
    nama: ''
  });

  const filteredKategori = kategori.filter(k => 
    k.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    k.tipe.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ tipe: 'Pemasukan', nama: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (kat: Kategori) => {
    setModalMode('edit');
    setEditId(kat.id);
    setFormData({ ...kat });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      addKategori(formData as Omit<Kategori, 'id'>);
    } else if (modalMode === 'edit' && editId) {
      editKategori(editId, formData);
    }
    setIsModalOpen(false);
  };

  const handleExport = () => {
    const dataToExport = kategori.map(k => ({
      'Tipe Pos': k.tipe,
      'Nama Kategori': k.nama
    }));
    exportToExcel(dataToExport, 'Data_Pos_Kategori');
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Pos Kategori</h2>
          <p>Kategori pencatatan untuk Pemasukan dan Pengeluaran (Chart of Accounts).</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline" style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }} onClick={handleExport}>
            <Download size={18} /> Simpan (Excel)
          </button>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Tambah Pos
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
              placeholder="Cari kategori..." 
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
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Tipe</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Nama Kategori</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredKategori.map((k) => (
                <tr key={k.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '50px', 
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: k.tipe === 'Pemasukan' ? '#d1fae5' : '#fee2e2',
                      color: k.tipe === 'Pemasukan' ? 'var(--success)' : 'var(--danger)'
                    }}>
                      {k.tipe}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{k.nama}</td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                    <button className="btn" style={{ padding: '0.4rem', color: 'var(--primary)' }} onClick={() => openEditModal(k)}><Edit size={16} /></button>
                    <button className="btn" style={{ padding: '0.4rem', color: 'var(--danger)' }} onClick={() => { if(confirm('Hapus kategori?')) deleteKategori(k.id); }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {filteredKategori.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Kategori tidak ditemukan.
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
        title={modalMode === 'add' ? 'Tambah Kategori' : 'Edit Kategori'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tipe Kategori</label>
            <select className="form-control" value={formData.tipe} onChange={(e) => setFormData({...formData, tipe: e.target.value as 'Pemasukan' | 'Pengeluaran'})} required>
              <option value="Pemasukan">Pemasukan</option>
              <option value="Pengeluaran">Pengeluaran</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Nama Kategori</label>
            <input type="text" className="form-control" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} required />
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

export default PosKategori;
