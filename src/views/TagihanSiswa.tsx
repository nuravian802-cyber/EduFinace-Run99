import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { useStore, type Tagihan } from '../store/useStore';
import Modal from '../components/Modal';

const TagihanSiswa: React.FC = () => {
  const { siswa, tagihan, addTagihan, addTagihanMassal, editTagihan, deleteTagihan, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSiswa, setExpandedSiswa] = useState<string[]>([]);
  
  const isSiswa = currentUser?.role === 'Siswa';

  React.useEffect(() => {
    if (isSiswa && currentUser) {
      setExpandedSiswa([currentUser.id]);
    }
  }, [isSiswa, currentUser]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add_individu' | 'add_massal' | 'edit'>('add_individu');
  const [editId, setEditId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Tagihan> & { kelas?: string }>({
    siswaId: '',
    namaTagihan: '',
    nominal: 0,
    jatuhTempo: new Date().toISOString().split('T')[0],
    kelas: 'Semua'
  });

  const [modalSearchSiswa, setModalSearchSiswa] = useState('');

  const uniqueClasses = Array.from(new Set(siswa.map(s => s.kelas))).sort();

  // Derived data
  const filteredSiswa = siswa.filter(s => {
    if (isSiswa) return s.id === currentUser?.id;
    return s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
           s.nis.includes(searchTerm);
  });

  const toggleExpand = (siswaId: string) => {
    setExpandedSiswa(prev => 
      prev.includes(siswaId) 
        ? prev.filter(id => id !== siswaId)
        : [...prev, siswaId]
    );
  };

  const openGenerateMassalModal = () => {
    setModalMode('add_massal');
    setFormData({ 
      namaTagihan: '', 
      nominal: 0, 
      jatuhTempo: new Date().toISOString().split('T')[0],
      kelas: 'Semua'
    });
    setIsModalOpen(true);
  };

  const openAddIndividuModal = () => {
    setModalMode('add_individu');
    setFormData({ 
      siswaId: siswa[0]?.id || '', 
      namaTagihan: '', 
      nominal: 0, 
      jatuhTempo: new Date().toISOString().split('T')[0] 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t: Tagihan) => {
    setModalMode('edit');
    setEditId(t.id);
    setFormData({ ...t });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add_individu') {
      if (!formData.siswaId) return alert('Pilih siswa terlebih dahulu');
      addTagihan(formData as Omit<Tagihan, 'id' | 'terbayar'>);
    } else if (modalMode === 'add_massal') {
      addTagihanMassal({
        namaTagihan: formData.namaTagihan as string,
        nominal: formData.nominal as number,
        jatuhTempo: formData.jatuhTempo as string,
        kelas: formData.kelas
      });
    } else if (modalMode === 'edit' && editId) {
      editTagihan(editId, formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (tId: string) => {
    if (confirm("Hapus rincian tagihan ini?")) {
      deleteTagihan(tId);
    }
  };

  const formatRp = (num: number) => new Intl.NumberFormat('id-ID').format(num);

  const handleKirimWA = (siswaData: typeof siswa[0], studentTagihan: typeof tagihan) => {
    const totalKekurangan = studentTagihan.reduce((sum, t) => sum + (t.nominal - t.terbayar), 0);
    if (totalKekurangan <= 0) {
      alert('Tidak ada tunggakan untuk siswa ini.');
      return;
    }
    
    let waNumber = siswaData.waOrangTua?.replace(/\D/g, '');
    if (!waNumber) {
      alert('Nomor WhatsApp orang tua tidak tersedia.');
      return;
    }
    if (waNumber.startsWith('0')) {
      waNumber = '62' + waNumber.substring(1);
    }
    
    const unpaidTags = studentTagihan.filter(t => (t.nominal - t.terbayar) > 0);
    const rincianText = unpaidTags.map(t => `- ${t.namaTagihan}: Rp ${formatRp(t.nominal - t.terbayar)}`).join('\n');
    
    const text = `Halo Bapak/Ibu ${siswaData.namaOrangTua},\nBerikut adalah informasi tagihan untuk siswa:\nNama: ${siswaData.nama}\nNIS: ${siswaData.nis}\nKelas: ${siswaData.kelas}\n\nRincian Tagihan Belum Lunas:\n${rincianText}\n\nTotal Kekurangan Tagihan: Rp ${formatRp(totalKekurangan)}\n\nMohon untuk dapat segera melakukan penyelesaian administrasi pembayaran. Terima kasih.`;
    
    window.open(`https://web.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }}>
            {isSiswa ? `Laman Tagihan ${currentUser?.nama}` : 'Data Tagihan Siswa'}
          </h2>
        </div>
        {!isSiswa && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Cari Siswa..." 
              style={{ paddingLeft: '2.25rem', width: '250px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-outline" style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }} onClick={openGenerateMassalModal}>
            Generate Massal
          </button>
          <button className="btn btn-primary" onClick={openAddIndividuModal}>
            + Tambah Individu
          </button>
        </div>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead style={{ backgroundColor: '#f8fafc' }}>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', color: '#1e293b', width: '30%' }}>Nama Siswa</th>
              <th style={{ padding: '1rem', color: '#1e293b', width: '25%' }}>Total Tagihan</th>
              <th style={{ padding: '1rem', color: '#1e293b', width: '25%' }}>Total Kekurangan</th>
              {!isSiswa && <th style={{ padding: '1rem', color: '#1e293b', textAlign: 'right', width: '20%' }}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {filteredSiswa.map((s) => {
              const studentTagihan = tagihan.filter(t => t.siswaId === s.id);
              const totalTagihan = studentTagihan.reduce((sum, t) => sum + t.nominal, 0);
              const totalKekurangan = studentTagihan.reduce((sum, t) => sum + (t.nominal - t.terbayar), 0);
              const isExpanded = expandedSiswa.includes(s.id);

              return (
                <React.Fragment key={s.id}>
                  {/* Main Row */}
                  <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'white' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => toggleExpand(s.id)}>
                      {isExpanded ? <ChevronDown size={18} color="var(--primary)" /> : <ChevronRight size={18} color="var(--text-muted)" />}
                      {s.nama}
                    </td>
                    <td style={{ padding: '1rem' }}>Rp {formatRp(totalTagihan)}</td>
                    <td style={{ padding: '1rem', color: totalKekurangan > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>
                      Rp {formatRp(totalKekurangan)}
                    </td>
                    {!isSiswa && (
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button className="btn btn-outline" style={{ padding: '0.4rem', color: '#16a34a', borderColor: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Kirim WA" onClick={() => handleKirimWA(s, studentTagihan)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                          </svg>
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }} onClick={() => toggleExpand(s.id)}>
                          Rincian
                        </button>
                      </div>
                    </td>
                    )}
                  </tr>

                  {/* Expanded Nested Table */}
                  {isExpanded && (
                    <tr style={{ backgroundColor: '#fafafa' }}>
                      <td colSpan={isSiswa ? 3 : 4} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ paddingLeft: '2rem', borderLeft: '3px solid var(--warning)' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '0.75rem', color: '#1e293b' }}>Rincian Pembayaran</th>
                                <th style={{ padding: '0.75rem', color: '#1e293b' }}>Nilai Tagihan</th>
                                <th style={{ padding: '0.75rem', color: '#1e293b' }}>Telah Dibayar</th>
                                <th style={{ padding: '0.75rem', color: '#1e293b' }}>Sisa Tagihan</th>
                                {!isSiswa && <th style={{ padding: '0.75rem', color: '#1e293b', textAlign: 'right' }}>Aksi</th>}
                              </tr>
                            </thead>
                            <tbody>
                              {studentTagihan.length > 0 ? studentTagihan.map(t => {
                                const sisa = t.nominal - t.terbayar;
                                return (
                                  <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{t.namaTagihan}</td>
                                    <td style={{ padding: '0.75rem' }}>Rp {formatRp(t.nominal)}</td>
                                    <td style={{ padding: '0.75rem', color: t.terbayar > 0 ? 'var(--success)' : 'inherit' }}>
                                      Rp {formatRp(t.terbayar)}
                                    </td>
                                    <td style={{ padding: '0.75rem', color: sisa > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
                                      Rp {formatRp(sisa)}
                                    </td>
                                    {!isSiswa && (
                                    <td style={{ padding: '0.75rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.25rem' }}>
                                      <button className="btn btn-primary" style={{ padding: '0.3rem', borderRadius: '4px' }} onClick={() => openEditModal(t)}><Edit size={14} /></button>
                                      <button className="btn btn-danger" style={{ padding: '0.3rem', borderRadius: '4px' }} onClick={() => handleDelete(t.id)}><Trash2 size={14} /></button>
                                    </td>
                                    )}
                                  </tr>
                                );
                              }) : (
                                <tr>
                                  <td colSpan={5} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Tidak ada tagihan untuk siswa ini.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {filteredSiswa.length === 0 && (
              <tr>
                <td colSpan={isSiswa ? 3 : 4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Data siswa tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalMode === 'add_massal' ? 'Generate Tagihan Massal' : modalMode === 'add_individu' ? 'Tambah Tagihan Individu' : 'Edit Tagihan'}
      >
        <form onSubmit={handleSubmit}>
          {modalMode === 'add_massal' && (
            <div className="form-group">
              <label className="form-label">Tujuan Kelas</label>
              <select className="form-control" value={formData.kelas || 'Semua'} onChange={(e) => setFormData({...formData, kelas: e.target.value})} required>
                <option value="Semua">-- Semua Kelas --</option>
                {uniqueClasses.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
          {modalMode === 'add_individu' && (
            <div className="form-group">
              <label className="form-label">Siswa</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Cari nama atau NIS siswa..." 
                value={modalSearchSiswa}
                onChange={(e) => setModalSearchSiswa(e.target.value)}
                style={{ marginBottom: '0.5rem' }}
              />
              <select className="form-control" value={formData.siswaId} onChange={(e) => setFormData({...formData, siswaId: e.target.value})} required>
                <option value="">-- Pilih Siswa --</option>
                {siswa.filter(s => s.nama.toLowerCase().includes(modalSearchSiswa.toLowerCase()) || s.nis.includes(modalSearchSiswa)).map(s => (
                  <option key={s.id} value={s.id}>{s.nama} - {s.nis}</option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Nama Tagihan</label>
            <input type="text" className="form-control" placeholder="Contoh: SPP Agustus" value={formData.namaTagihan} onChange={(e) => setFormData({...formData, namaTagihan: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Nominal (Rp)</label>
            <input type="number" className="form-control" placeholder="0" value={formData.nominal} onChange={(e) => setFormData({...formData, nominal: Number(e.target.value)})} required />
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Batal</button>
            <button type="submit" className="btn btn-primary">{modalMode === 'edit' ? 'Perbarui' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TagihanSiswa;
