import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useStore, type PosTagihan } from '../store/useStore';
import Modal from '../components/Modal';

const PosTagihanView: React.FC = () => {
  const { posTagihan, addPosTagihan, deletePosTagihan, editPosTagihan } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editId, setEditId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<PosTagihan>>({
    namaTagihan: '',
    nominal: 0
  });

  const filteredPosTagihan = posTagihan.filter(k => 
    k.namaTagihan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRp = (num: number) => new Intl.NumberFormat('id-ID').format(num);

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ namaTagihan: '', nominal: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (kat: PosTagihan) => {
    setModalMode('edit');
    setEditId(kat.id);
    setFormData({ ...kat });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      addPosTagihan(formData as Omit<PosTagihan, 'id'>);
    } else if (modalMode === 'edit' && editId) {
      editPosTagihan(editId, formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Pos Tagihan</h2>
          <p>Daftar tagihan yang dapat dikenakan kepada siswa (misal: SPP, Uang Gedung, dll).</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Tambah Pos Tagihan
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
              placeholder="Cari pos tagihan..." 
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
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Nama Tagihan</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Nominal</th>
                <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosTagihan.map((k) => (
                <tr key={k.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{k.namaTagihan}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>Rp {formatRp(k.nominal)}</td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                    <button className="btn" style={{ padding: '0.4rem', color: 'var(--primary)' }} onClick={() => openEditModal(k)}><Edit size={16} /></button>
                    <button className="btn" style={{ padding: '0.4rem', color: 'var(--danger)' }} onClick={() => { if(confirm('Hapus pos tagihan?')) deletePosTagihan(k.id); }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {filteredPosTagihan.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Pos tagihan tidak ditemukan.
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
        title={modalMode === 'add' ? 'Tambah Pos Tagihan' : 'Edit Pos Tagihan'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Tagihan</label>
            <input type="text" className="form-control" value={formData.namaTagihan} onChange={(e) => setFormData({...formData, namaTagihan: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Nominal (Rp)</label>
            <input 
              type="text" 
              inputMode="numeric"
              className="form-control" 
              value={formData.nominal ? Number(formData.nominal).toLocaleString('id-ID') : ''} 
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setFormData({...formData, nominal: val ? Number(val) : 0});
              }} 
              required 
            />
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

export default PosTagihanView;
