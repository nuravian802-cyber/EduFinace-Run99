import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useStore, type AkunKas as AkunKasType } from '../store/useStore';
import Modal from '../components/Modal';

const AkunKas: React.FC = () => {
  const { akunKas, addAkunKas, deleteAkunKas, editAkunKas } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editId, setEditId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<AkunKasType>>({
    kode: '',
    nama: '',
    saldo: 0
  });

  const filteredAkun = akunKas.filter(a => 
    a.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.kode.includes(searchTerm)
  );

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ kode: '', nama: '', saldo: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (akun: AkunKasType) => {
    setModalMode('edit');
    setEditId(akun.id);
    setFormData({ ...akun });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      addAkunKas(formData as Omit<AkunKasType, 'id'>);
    } else if (modalMode === 'edit' && editId) {
      editAkunKas(editId, formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Master Akun Kas</h2>
          <p>Pengelolaan sumber dana dan rekening bank.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Tambah Akun Kas
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
              placeholder="Cari nama akun atau kode..." 
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
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Kode Akun</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Nama Akun</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Saldo Saat Ini</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAkun.map((akun) => (
                <tr key={akun.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{akun.kode}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{akun.nama}</td>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>
                    Rp {akun.saldo.toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                    <button className="btn" style={{ padding: '0.4rem', color: 'var(--primary)' }} onClick={() => openEditModal(akun)}><Edit size={16} /></button>
                    <button className="btn" style={{ padding: '0.4rem', color: 'var(--danger)' }} onClick={() => { if(confirm('Hapus akun?')) deleteAkunKas(akun.id); }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {filteredAkun.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Akun kas tidak ditemukan.
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
        title={modalMode === 'add' ? 'Tambah Akun Kas' : 'Edit Akun Kas'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Kode Akun</label>
            <input type="text" className="form-control" placeholder="Contoh: 1-120" value={formData.kode} onChange={(e) => setFormData({...formData, kode: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Nama Akun</label>
            <input type="text" className="form-control" placeholder="Contoh: Bank BNI" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Saldo Awal</label>
            <input type="number" className="form-control" placeholder="0" value={formData.saldo} onChange={(e) => setFormData({...formData, saldo: Number(e.target.value)})} required />
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

export default AkunKas;
