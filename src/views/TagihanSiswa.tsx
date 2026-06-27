import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Edit, Trash2, Printer } from 'lucide-react';
import { useStore, type Tagihan } from '../store/useStore';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';

const TagihanSiswa: React.FC = () => {
  const { siswa, tagihan, posTagihan, addTagihanMulti, addTagihanMassal, editTagihan, deleteTagihan, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKelasFilter, setSelectedKelasFilter] = useState('Semua');
  const [statusTagihanFilter, setStatusTagihanFilter] = useState('Semua');
  const [expandedSiswa, setExpandedSiswa] = useState<string[]>([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSiswa = currentUser?.role === 'Siswa';
  const activeSiswa = siswa.filter(s => s.status !== 'Non-aktif');

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

  const [selectedPos, setSelectedPos] = useState<string[]>([]);

  const [modalSearchSiswa, setModalSearchSiswa] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const uniqueClasses = Array.from(new Set(activeSiswa.map(s => s.kelas))).sort();

  // Derived data
  const filteredSiswa = activeSiswa.filter(s => {
    if (isSiswa) return s.id === currentUser?.id;
    
    const matchSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
           s.nis.includes(searchTerm);
           
    const matchKelas = selectedKelasFilter === 'Semua' || s.kelas === selectedKelasFilter;
    
    let matchStatus = true;
    
    if (statusTagihanFilter !== 'Semua') {
      const studentTagihan = tagihan.filter(t => t.siswaId === s.id);
      const totalKekurangan = studentTagihan.reduce((sum, t) => sum + (t.nominal - (t.terbayar || 0)), 0);
      if (statusTagihanFilter === 'Ada Tagihan') {
        matchStatus = totalKekurangan > 0;
      } else if (statusTagihanFilter === 'Lunas') {
        matchStatus = totalKekurangan <= 0 && studentTagihan.length > 0;
      }
    }
    
    return matchSearch && matchKelas && matchStatus;
  });

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalItems = filteredSiswa.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedSiswa = isMobile ? filteredSiswa : filteredSiswa.slice(startIndex, startIndex + itemsPerPage);

  const toggleExpand = (siswaId: string) => {
    setExpandedSiswa(prev => 
      prev.includes(siswaId) 
        ? prev.filter(id => id !== siswaId)
        : [...prev, siswaId]
    );
  };

  const openGenerateMassalModal = () => {
    setModalMode('add_massal');
    setSelectedPos([]);
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
    setModalSearchSiswa('');
    setSelectedPos([]);
    setFormData({ 
      siswaId: '', 
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
    if (modalMode === 'add_individu' || modalMode === 'add_massal') {
      if (modalMode === 'add_individu' && !formData.siswaId) return alert('Pilih siswa terlebih dahulu');
      if (selectedPos.length === 0) return alert('Pilih minimal satu Pos Tagihan');

      const items = selectedPos.map(pid => {
        const pt = posTagihan.find(p => p.id === pid);
        return {
          namaTagihan: pt?.namaTagihan || '',
          nominal: pt?.nominal || 0,
          jatuhTempo: formData.jatuhTempo as string
        };
      }).filter(item => item.namaTagihan !== '');

      if (modalMode === 'add_individu') {
        addTagihanMulti(formData.siswaId, items);
      } else {
        addTagihanMassal({ items, kelas: formData.kelas });
      }
      setIsModalOpen(false);
    } else if (modalMode === 'edit' && editId) {
      editTagihan(editId, formData);
      setIsModalOpen(false);
    }
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
    <div className="animate-fade-in print-area">
      <style>
        {`
          @media print {
            @page {
              size: 215mm 330mm; /* F4 */
              margin: 15mm;
            }
            body, html, .app-layout, .main-content, .card {
              overflow-x: hidden !important;
            }
            .print-only {
              display: block !important;
            }
            .no-print {
              display: none !important;
            }
            ::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
            }
          }
        `}
      </style>
      <div className="page-header no-print">
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
          <button className="btn btn-outline no-print" style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }} onClick={openGenerateMassalModal}>
            Generate Massal
          </button>
          <button className="btn btn-primary no-print" onClick={openAddIndividuModal}>
            + Tambah Individu
          </button>
          <button className="btn btn-outline no-print" style={{ borderColor: 'var(--text-muted)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => window.print()}>
            <Printer size={16} />
            Cetak
          </button>
        </div>
        )}
      </div>

      {!isSiswa && (
      <div className="card no-print" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>Filter Kelas</label>
            <select 
              className="form-control" 
              value={selectedKelasFilter}
              onChange={(e) => setSelectedKelasFilter(e.target.value)}
            >
              <option value="Semua">Semua Kelas</option>
              {uniqueClasses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>Status Tagihan</label>
            <select 
              className="form-control" 
              value={statusTagihanFilter}
              onChange={(e) => setStatusTagihanFilter(e.target.value)}
            >
              <option value="Semua">Semua Status Tagihan</option>
              <option value="Ada Tagihan">Ada Tagihan</option>
              <option value="Lunas">Lunas</option>
            </select>
          </div>
        </div>
      </div>
      )}

      <div className="print-only" style={{ display: 'none', marginBottom: '1.5rem', textAlign: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Tagihan Siswa</h3>
      </div>
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead style={{ backgroundColor: '#f8fafc' }}>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', color: '#1e293b', width: '25%' }}>Nama Siswa</th>
              <th style={{ padding: '1rem', color: '#1e293b', width: '10%' }}>Kelas</th>
              <th style={{ padding: '1rem', color: '#1e293b', width: '25%' }}>Total Tagihan</th>
              <th style={{ padding: '1rem', color: '#1e293b', width: '25%' }}>Total Kekurangan</th>
              {!isSiswa && <th className="no-print" style={{ padding: '1rem', color: '#1e293b', textAlign: 'right', width: '15%' }}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {displayedSiswa.map((s) => {
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
                    <td style={{ padding: '1rem' }}>{s.kelas}</td>
                    <td style={{ padding: '1rem' }}>Rp {formatRp(totalTagihan)}</td>
                    <td style={{ padding: '1rem', color: totalKekurangan > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>
                      Rp {formatRp(totalKekurangan)}
                    </td>
                    {!isSiswa && (
                    <td className="no-print" style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button style={{ background: 'transparent', border: 'none', padding: 0, color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Kirim WA" onClick={() => handleKirimWA(s, studentTagihan)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 90 90">
                            <defs>
                              <linearGradient id="waGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#70e577" />
                                <stop offset="50%" stopColor="#34c840" />
                                <stop offset="100%" stopColor="#169c20" />
                              </linearGradient>
                              <linearGradient id="glossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                                <stop offset="40%" stopColor="#ffffff" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                              </linearGradient>
                              <filter id="shadow">
                                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
                              </filter>
                            </defs>
                            <path fill="url(#waGrad)" filter="url(#shadow)" d="M45,8 C24.6,8 8,24.6 8,45 C8,53 10.6,60.5 15,66.6 L9,83 L25.8,77.2 C31.6,81 38.1,83 45,83 C65.4,83 82,66.4 82,46 C82,25.6 65.4,8 45,8 Z" />
                            <path fill="none" stroke="#ffffff" strokeWidth="4.5" d="M45,13.5 C27.6,13.5 13.5,27.6 13.5,45 C13.5,51.8 15.7,58.1 19.5,63.2 L15,75.5 L27.7,71.2 C32.6,74.5 38.3,76.5 45,76.5 C62.4,76.5 76.5,62.4 76.5,45 C76.5,27.6 62.4,13.5 45,13.5 Z" />
                            <path fill="url(#glossGrad)" d="M45,8 C24.6,8 8,24.6 8,45 C8,45.5 8.1,46 8.1,46.5 C12.5,28 27.2,14 45,14 C62.8,14 77.5,28 81.9,46.5 C81.9,46 82,45.5 82,45 C82,24.6 65.4,8 45,8 Z" />
                            <path fill="#ffffff" d="M33,29 C31.5,29 29.5,30 29,32 C28,35.5 29.5,41 33.5,47.5 C37.5,54 43.5,58 48.5,59 C51,59.5 53.5,58 54.5,56 C55.5,54.5 56.5,51.5 56.5,50 C56.5,49.5 53.5,48 51.5,47.5 C49.5,47 48,47 47.5,48 C47,49 45,51 44.5,51 C44,51 42,50.5 39.5,48 C37,45.5 36.5,44 36.5,43.5 C36.5,43 37,42.5 38,41.5 C39,40.5 40,38.5 40,37.5 C40,36.5 39.5,35.5 39,34 C38,32 37,29 35,29 Z" />
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
                      <td colSpan={isSiswa ? 4 : 5} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ paddingLeft: '2rem', borderLeft: '3px solid var(--warning)' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '0.75rem', color: '#1e293b' }}>Rincian Pembayaran</th>
                                <th style={{ padding: '0.75rem', color: '#1e293b' }}>Nilai Tagihan</th>
                                <th style={{ padding: '0.75rem', color: '#1e293b' }}>Telah Dibayar</th>
                                <th style={{ padding: '0.75rem', color: '#1e293b' }}>Sisa Tagihan</th>
                                {!isSiswa && <th className="no-print" style={{ padding: '0.75rem', color: '#1e293b', textAlign: 'right' }}>Aksi</th>}
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
                                    <td className="no-print" style={{ padding: '0.75rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.25rem' }}>
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

            {displayedSiswa.length === 0 && (
              <tr>
                <td colSpan={isSiswa ? 4 : 5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Data siswa tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isMobile && totalItems > 10 && (
        <div className="no-print">
          <Pagination 
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      )}

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
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Siswa</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Cari nama atau NIS siswa..." 
                value={modalSearchSiswa}
                onChange={(e) => {
                  setModalSearchSiswa(e.target.value);
                  setIsDropdownOpen(true);
                  setFormData({...formData, siswaId: ''});
                }}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                required={!formData.siswaId}
              />
              {isDropdownOpen && (
                <div style={{ 
                  position: 'absolute', 
                  top: '100%', left: 0, right: 0, 
                  maxHeight: '180px', 
                  overflowY: 'auto', 
                  backgroundColor: 'white', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-sm)',
                  zIndex: 50,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}>
                  {activeSiswa.filter(s => s.nama.toLowerCase().includes(modalSearchSiswa.toLowerCase()) || s.nis.includes(modalSearchSiswa)).map(s => (
                    <div 
                      key={s.id} 
                      style={{ padding: '0.6rem 1rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}
                      onClick={() => {
                        setFormData({...formData, siswaId: s.id});
                        setModalSearchSiswa(`${s.nama} - ${s.nis}`);
                        setIsDropdownOpen(false);
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {s.nama} - {s.nis}
                    </div>
                  ))}
                  {activeSiswa.filter(s => s.nama.toLowerCase().includes(modalSearchSiswa.toLowerCase()) || s.nis.includes(modalSearchSiswa)).length === 0 && (
                    <div style={{ padding: '0.6rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tidak ditemukan</div>
                  )}
                </div>
              )}
            </div>
          )}

          {(modalMode === 'add_individu' || modalMode === 'add_massal') ? (
            <>
              <div className="form-group">
                <label className="form-label">Pilih Pos Tagihan</label>
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
                  {posTagihan.length === 0 ? (
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>Belum ada data pos tagihan. Silakan tambahkan di Master Data &gt; Pos Tagihan.</div>
                  ) : posTagihan.map(pt => (
                    <label key={pt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedPos.includes(pt.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedPos(prev => [...prev, pt.id]);
                          else setSelectedPos(prev => prev.filter(id => id !== pt.id));
                        }}
                      />
                      <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500 }}>{pt.namaTagihan}</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Rp {formatRp(pt.nominal)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Nama Tagihan</label>
                <input type="text" className="form-control" placeholder="Contoh: SPP Agustus" value={formData.namaTagihan} onChange={(e) => setFormData({...formData, namaTagihan: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Nominal (Rp)</label>
                <input type="text" inputMode="numeric" className="form-control" placeholder="0" value={formData.nominal ? Number(formData.nominal).toLocaleString('id-ID') : ''} onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); setFormData({...formData, nominal: val ? Number(val) : 0}) }} required />
              </div>
              <div className="form-group">
                <label className="form-label">Jatuh Tempo</label>
                <input type="date" className="form-control" value={formData.jatuhTempo} onChange={(e) => setFormData({...formData, jatuhTempo: e.target.value})} required />
              </div>
            </>
          )}
          
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
