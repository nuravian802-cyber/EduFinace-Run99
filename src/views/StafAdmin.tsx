import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useStore, type Admin } from '../store/useStore';
import Modal from '../components/Modal';

const StafAdmin: React.FC = () => {
  const { admin, addAdmin, deleteAdmin, editAdmin } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editId, setEditId] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Admin>>({
    username: '',
    password: '',
    nama: '',
    role: 'Super Admin'
  });

  const filteredAdmin = admin.filter(a => 
    a.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ username: '', password: '', nama: '', role: 'Super Admin' });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const openEditModal = (adm: Admin) => {
    setModalMode('edit');
    setEditId(adm.id);
    setFormData({ ...adm });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      addAdmin(formData as Omit<Admin, 'id'>);
    } else if (modalMode === 'edit' && editId) {
      editAdmin(editId, formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Staf Admin</h2>
          <p>Kelola akun yang memiliki akses ke sistem ini.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Tambah Staf
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Cari nama atau username..." 
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
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Username</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Nama Lengkap</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Role</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmin.map((adm) => (
                <tr key={adm.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{adm.username}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{adm.nama}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '50px', 
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: adm.role === 'Super Admin' ? '#d1fae5' : adm.role === 'Kepala Sekolah' ? '#e0e7ff' : '#fef3c7',
                      color: adm.role === 'Super Admin' ? 'var(--success)' : adm.role === 'Kepala Sekolah' ? 'var(--primary)' : '#d97706'
                    }}>
                      {adm.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                    <button className="btn" style={{ padding: '0.4rem', color: 'var(--primary)' }} onClick={() => openEditModal(adm)}><Edit size={16} /></button>
                    <button className="btn" style={{ padding: '0.4rem', color: 'var(--danger)' }} onClick={() => { if(confirm('Hapus staf ini?')) deleteAdmin(adm.id); }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {filteredAdmin.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Data staf admin tidak ditemukan.
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
        title={modalMode === 'add' ? 'Tambah Staf Admin' : 'Edit Staf Admin'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? "text" : "password"} className="form-control" placeholder={modalMode === 'edit' ? '(Kosongkan jika tidak ingin mengubah)' : ''} value={formData.password || ''} onChange={(e) => setFormData({...formData, password: e.target.value})} required={modalMode === 'add'} style={{ paddingRight: '2.5rem' }} />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input type="text" className="form-control" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-control" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value as 'Super Admin' | 'Kepala Sekolah' | 'Bendahara'})} required>
              <option value="Super Admin">Super Admin</option>
              <option value="Kepala Sekolah">Kepala Sekolah</option>
              <option value="Bendahara">Bendahara</option>
            </select>
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

export default StafAdmin;
