import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Siswa {
  id: string;
  nis: string;
  nisn: string;
  nama: string;
  password?: string;
  kelas: string;
  tanggalLahir?: string;
  namaOrangTua: string;
  waOrangTua: string;
}

export interface Admin {
  id: string;
  username: string;
  password?: string;
  nama: string;
  role: 'Super Admin' | 'Kepala Sekolah';
}

export interface UserSession {
  id: string;
  username: string;
  nama: string;
  role: 'Super Admin' | 'Kepala Sekolah' | 'Siswa';
}

export interface AkunKas {
  id: string;
  kode: string;
  nama: string;
  saldo: number;
}

export interface Kategori {
  id: string;
  tipe: 'Pemasukan' | 'Pengeluaran';
  nama: string;
}

export interface Tagihan {
  id: string;
  siswaId: string;
  namaTagihan: string;
  nominal: number;
  terbayar: number;
  jatuhTempo: string;
}

export interface Transaksi {
  id: string;
  tanggal: string;
  tipe: 'Pemasukan' | 'Pengeluaran';
  akunId: string;
  kategoriId: string | null;
  tagihanId: string | null;
  nominal: number;
  keterangan: string;
}

interface AppState {
  siswa: Siswa[];
  akunKas: AkunKas[];
  kategori: Kategori[];
  tagihan: Tagihan[];
  transaksi: Transaksi[];
  admin: Admin[];
  currentUser: UserSession | null;
  
  // Actions
  login: (session: UserSession) => void;
  logout: () => void;
  addSiswa: (data: Omit<Siswa, 'id'>) => void;
  editSiswa: (id: string, data: Partial<Omit<Siswa, 'id'>>) => void;
  deleteSiswa: (id: string) => void;
  
  addAkunKas: (data: Omit<AkunKas, 'id'>) => void;
  editAkunKas: (id: string, data: Partial<Omit<AkunKas, 'id'>>) => void;
  deleteAkunKas: (id: string) => void;
  
  addKategori: (data: Omit<Kategori, 'id'>) => void;
  editKategori: (id: string, data: Partial<Omit<Kategori, 'id'>>) => void;
  deleteKategori: (id: string) => void;
  
  addTagihan: (data: Omit<Tagihan, 'id' | 'terbayar'>) => void;
  addTagihanMassal: (data: Omit<Tagihan, 'id' | 'terbayar' | 'siswaId'> & { kelas?: string }) => void;
  editTagihan: (id: string, data: Partial<Omit<Tagihan, 'id' | 'terbayar'>>) => void;
  deleteTagihan: (id: string) => void;
  
  // Transaksi
  catatPendapatanLain: (data: Omit<Transaksi, 'id' | 'tipe' | 'tagihanId'>) => void;
  catatPengeluaran: (data: Omit<Transaksi, 'id' | 'tipe' | 'tagihanId'>) => void;
  bayarTagihan: (tagihanId: string, akunId: string, nominal: number, tanggal: string) => void;
  bayarMultiTagihan: (pembayaran: { tagihanId: string, nominal: number }[], akunId: string, tanggal: string) => void;
  deleteTransaksi: (id: string) => void;
  editTransaksi: (id: string, data: Partial<Transaksi>) => void;

  addAdmin: (data: Omit<Admin, 'id'>) => void;
  editAdmin: (id: string, data: Partial<Omit<Admin, 'id'>>) => void;
  deleteAdmin: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      siswa: [
        { id: '1', nis: '1001', nisn: '0051234567', nama: 'ARIS', kelas: '10-A', namaOrangTua: 'Bpk. Aris', waOrangTua: '081234567890' },
        { id: '2', nis: '1002', nisn: '0057654321', nama: 'ARIK', kelas: '10-B', namaOrangTua: 'Ibu Arik', waOrangTua: '081298765432' },
      ],
      akunKas: [
        { id: '1', kode: '1-100', nama: 'Kas Tunai', saldo: 15000000 },
        { id: '2', kode: '1-110', nama: 'Bank BCA', saldo: 90000000 },
      ],
      kategori: [
        { id: '1', tipe: 'Pemasukan', nama: 'Pendapatan Lain' },
        { id: '2', tipe: 'Pengeluaran', nama: 'Gaji Pegawai' },
        { id: '3', tipe: 'Pengeluaran', nama: 'Operasional' },
      ],
      tagihan: [
        { id: '1', siswaId: '1', namaTagihan: 'Seragam 2025', nominal: 450000, terbayar: 400000, jatuhTempo: '2026-07-10' },
        { id: '2', siswaId: '1', namaTagihan: 'INFAQ JULI 2026', nominal: 300000, terbayar: 300000, jatuhTempo: '2026-07-20' },
        { id: '3', siswaId: '1', namaTagihan: 'INFAQ FEBRUARI 2026', nominal: 30000, terbayar: 0, jatuhTempo: '2026-02-10' },
        { id: '4', siswaId: '2', namaTagihan: 'Seragam 2025', nominal: 450000, terbayar: 50000, jatuhTempo: '2026-07-10' },
      ],
      transaksi: [],
      admin: [
        { id: '1', username: 'admin', password: 'password123', nama: 'Admin Utama', role: 'Super Admin' },
        { id: '2', username: 'kepsek', password: 'password123', nama: 'Bpk. Budi Santoso', role: 'Kepala Sekolah' }
      ],
      currentUser: null,

      login: (session) => set({ currentUser: session }),
      logout: () => set({ currentUser: null }),

      addSiswa: (data) => set((state) => ({ siswa: [...state.siswa, { ...data, id: generateId() }] })),
      editSiswa: (id, data) => set((state) => ({ siswa: state.siswa.map(s => s.id === id ? { ...s, ...data } : s) })),
      deleteSiswa: (id) => set((state) => ({ siswa: state.siswa.filter(s => s.id !== id) })),
      
      addAkunKas: (data) => set((state) => ({ akunKas: [...state.akunKas, { ...data, id: generateId() }] })),
      editAkunKas: (id, data) => set((state) => ({ akunKas: state.akunKas.map(a => a.id === id ? { ...a, ...data } : a) })),
      deleteAkunKas: (id) => set((state) => ({ akunKas: state.akunKas.filter(a => a.id !== id) })),
      
      addKategori: (data) => set((state) => ({ kategori: [...state.kategori, { ...data, id: generateId() }] })),
      editKategori: (id, data) => set((state) => ({ kategori: state.kategori.map(k => k.id === id ? { ...k, ...data } : k) })),
      deleteKategori: (id) => set((state) => ({ kategori: state.kategori.filter(k => k.id !== id) })),
      
      addTagihan: (data) => set((state) => ({ tagihan: [...state.tagihan, { ...data, id: generateId(), terbayar: 0 }] })),
      addTagihanMassal: (data) => set((state) => {
        const { kelas, ...tagihanData } = data;
        let targetSiswa = state.siswa;
        if (kelas && kelas !== 'Semua') {
          targetSiswa = targetSiswa.filter(s => s.kelas === kelas);
        }
        const newTagihans = targetSiswa.map(s => ({
          ...tagihanData,
          siswaId: s.id,
          id: generateId(),
          terbayar: 0
        }));
        return { tagihan: [...state.tagihan, ...newTagihans] };
      }),
      editTagihan: (id, data) => set((state) => ({ tagihan: state.tagihan.map(t => t.id === id ? { ...t, ...data } : t) })),
      deleteTagihan: (id) => set((state) => ({ tagihan: state.tagihan.filter(t => t.id !== id) })),

      catatPendapatanLain: (data) => set((state) => {
        const trId = generateId();
        return {
          transaksi: [...state.transaksi, { ...data, id: trId, tipe: 'Pemasukan', tagihanId: null }],
          akunKas: state.akunKas.map(a => a.id === data.akunId ? { ...a, saldo: a.saldo + Number(data.nominal) } : a)
        };
      }),

      catatPengeluaran: (data) => set((state) => {
        const trId = generateId();
        return {
          transaksi: [...state.transaksi, { ...data, id: trId, tipe: 'Pengeluaran', tagihanId: null }],
          akunKas: state.akunKas.map(a => a.id === data.akunId ? { ...a, saldo: a.saldo - Number(data.nominal) } : a)
        };
      }),

      bayarTagihan: (tagihanId, akunId, nominal, tanggal) => set((state) => {
        const tagihan = state.tagihan.find(t => t.id === tagihanId);
        if (!tagihan) return state;

        const numNominal = Number(nominal);
        return {
          tagihan: state.tagihan.map(t => t.id === tagihanId ? { ...t, terbayar: t.terbayar + numNominal } : t),
          akunKas: state.akunKas.map(a => a.id === akunId ? { ...a, saldo: a.saldo + numNominal } : a),
          transaksi: [...state.transaksi, { 
            id: generateId(), 
            tanggal, 
            tipe: 'Pemasukan', 
            akunId, 
            kategoriId: null, 
            tagihanId, 
            nominal: numNominal, 
            keterangan: `Pembayaran ${tagihan.namaTagihan}` 
          }]
        };
      }),

      bayarMultiTagihan: (pembayaran, akunId, tanggal) => set((state) => {
        let updatedTagihan = [...state.tagihan];
        let totalNominal = 0;
        let newTransaksi: Transaksi[] = [];

        pembayaran.forEach(p => {
          const tagihan = state.tagihan.find(t => t.id === p.tagihanId);
          if (!tagihan) return;
          const numNominal = Number(p.nominal);
          totalNominal += numNominal;
          
          updatedTagihan = updatedTagihan.map(t => t.id === p.tagihanId ? { ...t, terbayar: t.terbayar + numNominal } : t);
          newTransaksi.push({
            id: generateId(), 
            tanggal, 
            tipe: 'Pemasukan', 
            akunId, 
            kategoriId: null, 
            tagihanId: p.tagihanId, 
            nominal: numNominal, 
            keterangan: `Pembayaran (Masal) ${tagihan.namaTagihan}` 
          });
        });

        return {
          tagihan: updatedTagihan,
          akunKas: state.akunKas.map(a => a.id === akunId ? { ...a, saldo: a.saldo + totalNominal } : a),
          transaksi: [...state.transaksi, ...newTransaksi]
        };
      }),

      deleteTransaksi: (id) => set((state) => {
        const tr = state.transaksi.find(t => t.id === id);
        if (!tr) return state;

        let updatedAkunKas = [...state.akunKas];
        let updatedTagihan = [...state.tagihan];

        // Revert Kas
        updatedAkunKas = updatedAkunKas.map(a => {
          if (a.id === tr.akunId) {
            return {
              ...a,
              saldo: tr.tipe === 'Pemasukan' ? a.saldo - tr.nominal : a.saldo + tr.nominal
            };
          }
          return a;
        });

        // Revert Tagihan
        if (tr.tagihanId) {
          updatedTagihan = updatedTagihan.map(t => {
            if (t.id === tr.tagihanId) {
              return { ...t, terbayar: t.terbayar - tr.nominal };
            }
            return t;
          });
        }

        return {
          transaksi: state.transaksi.filter(t => t.id !== id),
          akunKas: updatedAkunKas,
          tagihan: updatedTagihan
        };
      }),

      editTransaksi: (id, data) => set((state) => {
        const oldTr = state.transaksi.find(t => t.id === id);
        if (!oldTr) return state;

        let updatedAkunKas = [...state.akunKas];
        let updatedTagihan = [...state.tagihan];

        // 1. Revert old transaction effects
        updatedAkunKas = updatedAkunKas.map(a => {
          if (a.id === oldTr.akunId) {
            return {
              ...a,
              saldo: oldTr.tipe === 'Pemasukan' ? a.saldo - oldTr.nominal : a.saldo + oldTr.nominal
            };
          }
          return a;
        });

        if (oldTr.tagihanId) {
          updatedTagihan = updatedTagihan.map(t => {
            if (t.id === oldTr.tagihanId) {
              return { ...t, terbayar: t.terbayar - oldTr.nominal };
            }
            return t;
          });
        }

        // 2. Apply new transaction effects
        const newTr = { ...oldTr, ...data };
        
        updatedAkunKas = updatedAkunKas.map(a => {
          if (a.id === newTr.akunId) {
            return {
              ...a,
              saldo: newTr.tipe === 'Pemasukan' ? a.saldo + newTr.nominal : a.saldo - newTr.nominal
            };
          }
          return a;
        });

        if (newTr.tagihanId) {
          updatedTagihan = updatedTagihan.map(t => {
            if (t.id === newTr.tagihanId) {
              return { ...t, terbayar: t.terbayar + newTr.nominal };
            }
            return t;
          });
        }

        return {
          transaksi: state.transaksi.map(t => t.id === id ? newTr : t),
          akunKas: updatedAkunKas,
          tagihan: updatedTagihan
        };
      }),

      addAdmin: (data) => set((state) => ({ admin: [...state.admin, { ...data, id: generateId() }] })),
      editAdmin: (id, data) => set((state) => ({ admin: state.admin.map(a => a.id === id ? { ...a, ...data } : a) })),
      deleteAdmin: (id) => set((state) => ({ admin: state.admin.filter(a => a.id !== id) })),
    }),
    {
      name: 'edufinance-storage',
    }
  )
);
