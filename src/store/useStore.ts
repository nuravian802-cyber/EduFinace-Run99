import { create } from 'zustand';
import * as api from '../services/supabaseApi';
import { sendPaymentNotification } from '../services/waService';

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
  status?: 'Aktif' | 'Non-aktif';
}

export interface Admin {
  id: string;
  username: string;
  password?: string;
  nama: string;
  role: 'Super Admin' | 'Kepala Sekolah' | 'Bendahara';
}

export interface UserSession {
  id: string;
  username: string;
  nama: string;
  role: 'Super Admin' | 'Kepala Sekolah' | 'Siswa' | 'Bendahara';
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

export interface PosTagihan {
  id: string;
  namaTagihan: string;
  nominal: number;
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
  buktiTransaksi?: string;
}

export interface ProfilSekolah {
  nama: string;
  alamat: string;
  npsn: string;
}

interface AppState {
  isInitialized: boolean;
  profilSekolah: ProfilSekolah;
  siswa: Siswa[];
  akunKas: AkunKas[];
  kategori: Kategori[];
  posTagihan: PosTagihan[];
  tagihan: Tagihan[];
  transaksi: Transaksi[];
  admin: Admin[];
  currentUser: UserSession | null;
  
  // Actions
  fetchDataAwal: () => Promise<void>;
  updateProfil: (data: Partial<ProfilSekolah>) => Promise<void>;
  login: (session: UserSession) => void;
  logout: () => void;
  
  addSiswa: (data: Omit<Siswa, 'id'>) => Promise<void>;
  editSiswa: (id: string, data: Partial<Omit<Siswa, 'id'>>) => Promise<void>;
  deleteSiswa: (id: string) => Promise<void>;
  toggleStatusSiswa: (id: string) => Promise<void>;
  naikKelasMassal: (kelasAsal: string, kelasTujuan: string) => Promise<void>;
  
  addAkunKas: (data: Omit<AkunKas, 'id'>) => Promise<void>;
  editAkunKas: (id: string, data: Partial<Omit<AkunKas, 'id'>>) => Promise<void>;
  deleteAkunKas: (id: string) => Promise<void>;
  
  addKategori: (data: Omit<Kategori, 'id'>) => Promise<void>;
  editKategori: (id: string, data: Partial<Omit<Kategori, 'id'>>) => Promise<void>;
  deleteKategori: (id: string) => Promise<void>;
  
  addPosTagihan: (data: Omit<PosTagihan, 'id'>) => Promise<void>;
  editPosTagihan: (id: string, data: Partial<Omit<PosTagihan, 'id'>>) => Promise<void>;
  deletePosTagihan: (id: string) => Promise<void>;
  
  addTagihan: (data: Omit<Tagihan, 'id' | 'terbayar'>) => Promise<void>;
  addTagihanMulti: (siswaId: string, items: { namaTagihan: string, nominal: number, jatuhTempo: string }[]) => Promise<void>;
  addTagihanMassal: (data: { items: { namaTagihan: string, nominal: number, jatuhTempo: string }[], kelas?: string }) => Promise<void>;
  editTagihan: (id: string, data: Partial<Omit<Tagihan, 'id' | 'terbayar'>>) => Promise<void>;
  deleteTagihan: (id: string) => Promise<void>;
  
  // Transaksi
  catatPendapatanLain: (data: Omit<Transaksi, 'id' | 'tipe' | 'tagihanId'>) => Promise<void>;
  catatPengeluaran: (data: Omit<Transaksi, 'id' | 'tipe' | 'tagihanId'>) => Promise<void>;
  bayarTagihan: (tagihanId: string, akunId: string, nominal: number, tanggal: string) => Promise<void>;
  bayarMultiTagihan: (pembayaran: { tagihanId: string, nominal: number }[], akunId: string, tanggal: string, diskon?: number, keteranganDiskon?: string) => Promise<void>;
  deleteTransaksi: (id: string) => Promise<void>;
  editTransaksi: (id: string, data: Partial<Transaksi>) => Promise<void>;

  addAdmin: (data: Omit<Admin, 'id'>) => Promise<void>;
  editAdmin: (id: string, data: Partial<Omit<Admin, 'id'>>) => Promise<void>;
  deleteAdmin: (id: string) => Promise<void>;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useStore = create<AppState>()((set, get) => ({
  isInitialized: false,
  profilSekolah: {
    nama: 'SMA EduFinance Gemilang',
    alamat: 'Jl. Pendidikan No. 123, Jakarta Selatan',
    npsn: '12345678'
  },
  siswa: [],
  akunKas: [],
  kategori: [],
  posTagihan: [],
  tagihan: [],
  transaksi: [],
  admin: [],
  currentUser: null,

  fetchDataAwal: async () => {
    // Check if already initialized to prevent multiple fetches
    if (get().isInitialized) return;
    
    try {
      const [profil, kas, siswa, admin, kategori, pos_tagihan, tagihan, transaksi] = await Promise.all([
        api.getProfilSekolah(),
        api.getAkunKas(),
        api.getDataSiswaLengkap(),
        api.getPenggunaStafAdmin(),
        api.getPosKategori(),
        api.getPosTagihan(),
        api.getTagihanSiswa(),
        api.getRiwayatTransaksi()
      ]);

      set({
        profilSekolah: profil || get().profilSekolah,
        akunKas: kas || [],
        siswa: siswa || [],
        admin: admin || [],
        kategori: kategori || [],
        posTagihan: pos_tagihan || [],
        tagihan: tagihan || [],
        transaksi: transaksi || [],
        isInitialized: true
      });
    } catch (err) {
      console.error('Error fetching initial data from Supabase:', err);
    }
  },

  updateProfil: async (data) => {
    const res = await api.updateProfilSekolah('1', data);
    if (res) {
      set((state) => ({ profilSekolah: { ...state.profilSekolah, ...data } }));
    }
  },
  
  login: (session) => {
    // Save to local storage manually to persist login
    localStorage.setItem('currentUser', JSON.stringify(session));
    set({ currentUser: session });
  },
  logout: () => {
    localStorage.removeItem('currentUser');
    set({ currentUser: null });
  },

  addSiswa: async (data) => {
    const insertData = { ...data, id: generateId(), status: 'Aktif' };
    const res = await api.addDataSiswaLengkap(insertData);
    if (res) set((state) => ({ siswa: [...state.siswa, insertData as Siswa] }));
  },
  editSiswa: async (id, data) => {
    const res = await api.updateDataSiswaLengkap(id, data);
    if (res) set((state) => ({ siswa: state.siswa.map(s => s.id === id ? { ...s, ...data } : s) }));
  },
  deleteSiswa: async (id) => {
    const res = await api.deleteDataSiswaLengkap(id);
    if (res) set((state) => ({ siswa: state.siswa.filter(s => s.id !== id) }));
  },
  toggleStatusSiswa: async (id) => {
    const siswa = get().siswa.find(s => s.id === id);
    if (!siswa) return;
    const newStatus = siswa.status === 'Non-aktif' ? 'Aktif' : 'Non-aktif';
    const res = await api.updateDataSiswaLengkap(id, { status: newStatus });
    if (res) set((state) => ({ 
      siswa: state.siswa.map(s => s.id === id ? { ...s, status: newStatus } : s) 
    }));
  },
  naikKelasMassal: async (kelasAsal, kelasTujuan) => {
    const isLulus = kelasTujuan.toLowerCase() === 'lulus';
    const res = await api.updateKelasMassalSiswa(kelasAsal, kelasTujuan);
    if (res) {
      set((state) => ({
        siswa: state.siswa.map(s => s.kelas === kelasAsal ? { ...s, kelas: kelasTujuan, ...(isLulus ? { status: 'Non-aktif' } : {}) } : s)
      }));
    }
  },
  
  addAkunKas: async (data) => {
    const insertData = { ...data, id: generateId() };
    const res = await api.addAkunKas(insertData);
    if (res) set((state) => ({ akunKas: [...state.akunKas, insertData as AkunKas] }));
  },
  editAkunKas: async (id, data) => {
    const res = await api.updateAkunKas(id, data);
    if (res) set((state) => ({ akunKas: state.akunKas.map(a => a.id === id ? { ...a, ...data } : a) }));
  },
  deleteAkunKas: async (id) => {
    const res = await api.deleteAkunKas(id);
    if (res) set((state) => ({ akunKas: state.akunKas.filter(a => a.id !== id) }));
  },
  
  addKategori: async (data) => {
    const insertData = { ...data, id: generateId() };
    const res = await api.addPosKategori(insertData);
    if (res) set((state) => ({ kategori: [...state.kategori, insertData as Kategori] }));
  },
  editKategori: async (id, data) => {
    const res = await api.updatePosKategori(id, data);
    if (res) set((state) => ({ kategori: state.kategori.map(k => k.id === id ? { ...k, ...data } : k) }));
  },
  deleteKategori: async (id) => {
    const res = await api.deletePosKategori(id);
    if (res) set((state) => ({ kategori: state.kategori.filter(k => k.id !== id) }));
  },
  
  addPosTagihan: async (data) => {
    const insertData = { ...data, id: generateId() };
    const res = await api.addPosTagihan(insertData);
    if (res) set((state) => ({ posTagihan: [...state.posTagihan, insertData as PosTagihan] }));
  },
  editPosTagihan: async (id, data) => {
    const res = await api.updatePosTagihan(id, data);
    if (res) set((state) => ({ posTagihan: state.posTagihan.map(k => k.id === id ? { ...k, ...data } : k) }));
  },
  deletePosTagihan: async (id) => {
    const res = await api.deletePosTagihan(id);
    if (res) set((state) => ({ posTagihan: state.posTagihan.filter(k => k.id !== id) }));
  },
  
  addTagihan: async (data) => {
    const insertData = { ...data, id: generateId(), terbayar: 0 };
    const res = await api.addTagihanSiswa(insertData);
    if (res) set((state) => ({ tagihan: [...state.tagihan, insertData as Tagihan] }));
  },
  addTagihanMulti: async (siswaId, items) => {
    if (!siswaId || items.length === 0) return;
    const newTagihans = items.map(item => ({
      ...item,
      siswaId,
      id: generateId(),
      terbayar: 0
    }));
    const res = await api.addTagihanSiswaMassal(newTagihans);
    if (res) {
      set((state) => ({ tagihan: [...state.tagihan, ...newTagihans as Tagihan[]] }));
    }
  },
  addTagihanMassal: async (data) => {
    const { kelas, items } = data;
    const state = get();
    let targetSiswa = state.siswa.filter(s => s.status !== 'Non-aktif');
    if (kelas && kelas !== 'Semua') {
      targetSiswa = targetSiswa.filter(s => s.kelas === kelas);
    }
    
    if (targetSiswa.length === 0 || items.length === 0) return;

    const newTagihans: any[] = [];
    
    targetSiswa.forEach(s => {
      items.forEach(item => {
        newTagihans.push({
          ...item,
          siswaId: s.id,
          id: generateId(),
          terbayar: 0
        });
      });
    });

    const res = await api.addTagihanSiswaMassal(newTagihans);
    if (res) {
      set((state) => ({ tagihan: [...state.tagihan, ...newTagihans as Tagihan[]] }));
    }
  },
  editTagihan: async (id, data) => {
    const res = await api.updateTagihanSiswa(id, data);
    if (res) set((state) => ({ tagihan: state.tagihan.map(t => t.id === id ? { ...t, ...data } : t) }));
  },
  deleteTagihan: async (id) => {
    const res = await api.deleteTagihanSiswa(id);
    if (res) set((state) => ({ tagihan: state.tagihan.filter(t => t.id !== id) }));
  },

  catatPendapatanLain: async (data) => {
    const trId = generateId();
    const insertData = { ...data, id: trId, tipe: 'Pemasukan', tagihanId: null };
    const state = get();
    const akun = state.akunKas.find(a => a.id === data.akunId);
    if (!akun) return;

    const newSaldo = akun.saldo + Number(data.nominal);

    await Promise.all([
      api.addRiwayatTransaksi(insertData),
      api.updateAkunKas(data.akunId, { saldo: newSaldo })
    ]);

    set((state) => ({
      transaksi: [...state.transaksi, insertData as Transaksi],
      akunKas: state.akunKas.map(a => a.id === data.akunId ? { ...a, saldo: newSaldo } : a)
    }));
  },

  catatPengeluaran: async (data) => {
    const trId = generateId();
    const insertData = { ...data, id: trId, tipe: 'Pengeluaran', tagihanId: null };
    const state = get();
    const akun = state.akunKas.find(a => a.id === data.akunId);
    if (!akun) return;

    const newSaldo = akun.saldo - Number(data.nominal);

    await Promise.all([
      api.addRiwayatTransaksi(insertData),
      api.updateAkunKas(data.akunId, { saldo: newSaldo })
    ]);

    set((state) => ({
      transaksi: [...state.transaksi, insertData as Transaksi],
      akunKas: state.akunKas.map(a => a.id === data.akunId ? { ...a, saldo: newSaldo } : a)
    }));
  },

  bayarTagihan: async (tagihanId, akunId, nominal, tanggal) => {
    const state = get();
    const tagihan = state.tagihan.find(t => t.id === tagihanId);
    const akun = state.akunKas.find(a => a.id === akunId);
    if (!tagihan || !akun) return;

    const numNominal = Number(nominal);
    const newTerbayar = tagihan.terbayar + numNominal;
    const newSaldo = akun.saldo + numNominal;
    
    const trId = generateId();
    const newTransaksi = { 
      id: trId, 
      tanggal, 
      tipe: 'Pemasukan', 
      akunId, 
      kategoriId: null, 
      tagihanId, 
      nominal: numNominal, 
      keterangan: `Pembayaran ${tagihan.namaTagihan}` 
    };

    await Promise.all([
      api.updateTagihanSiswa(tagihanId, { terbayar: newTerbayar }),
      api.updateAkunKas(akunId, { saldo: newSaldo }),
      api.addRiwayatTransaksi(newTransaksi)
    ]);

    const siswa = state.siswa.find(s => s.id === tagihan.siswaId);
    if (siswa && siswa.waOrangTua) {
      sendPaymentNotification(
        siswa.waOrangTua,
        siswa.namaOrangTua,
        siswa.nama,
        siswa.kelas,
        [{ paymentName: tagihan.namaTagihan, amount: numNominal }],
        tanggal,
        state.profilSekolah.nama
      );
    }

    set((state) => ({
      tagihan: state.tagihan.map(t => t.id === tagihanId ? { ...t, terbayar: newTerbayar } : t),
      akunKas: state.akunKas.map(a => a.id === akunId ? { ...a, saldo: newSaldo } : a),
      transaksi: [...state.transaksi, newTransaksi as Transaksi]
    }));
  },

  bayarMultiTagihan: async (pembayaran, akunId, tanggal, diskon = 0, keteranganDiskon = '') => {
    const state = get();
    let totalNominal = 0;
    const newTransaksi: Transaksi[] = [];
    const updatePromises: Promise<any>[] = [];
    const updatedTagihanLocal = [...state.tagihan];

    pembayaran.forEach(p => {
      const tagihan = state.tagihan.find(t => t.id === p.tagihanId);
      if (!tagihan) return;
      const numNominal = Number(p.nominal);
      totalNominal += numNominal;
      
      const newTerbayar = tagihan.terbayar + numNominal;
      
      updatePromises.push(api.updateTagihanSiswa(p.tagihanId, { terbayar: newTerbayar }));
      
      const idx = updatedTagihanLocal.findIndex(t => t.id === p.tagihanId);
      if (idx !== -1) updatedTagihanLocal[idx] = { ...updatedTagihanLocal[idx], terbayar: newTerbayar };

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

    if (diskon > 0) {
      newTransaksi.push({
        id: generateId(),
        tanggal,
        tipe: 'Pengeluaran',
        akunId,
        kategoriId: null,
        tagihanId: undefined, // no specific tagihan for combined discount
        nominal: diskon,
        keterangan: keteranganDiskon ? `Diskon: ${keteranganDiskon}` : 'Potongan/Diskon Pembayaran'
      });
    }

    const akun = state.akunKas.find(a => a.id === akunId);
    if (akun) {
      const newSaldo = akun.saldo + totalNominal - diskon;
      updatePromises.push(api.updateAkunKas(akunId, { saldo: newSaldo }));
    }

    if (newTransaksi.length > 0) {
      updatePromises.push(api.addRiwayatTransaksiMassal(newTransaksi));
    }

    await Promise.all(updatePromises);

    const groupedPayments: Record<string, { siswa: any, payments: { paymentName: string, amount: number }[] }> = {};
    
    pembayaran.forEach(p => {
      const tagihan = state.tagihan.find(t => t.id === p.tagihanId);
      if (!tagihan) return;
      const siswa = state.siswa.find(s => s.id === tagihan.siswaId);
      if (!siswa || !siswa.waOrangTua) return;
      
      if (!groupedPayments[siswa.id]) {
        groupedPayments[siswa.id] = { siswa, payments: [] };
      }
      groupedPayments[siswa.id].payments.push({
        paymentName: tagihan.namaTagihan,
        amount: Number(p.nominal)
      });
    });

    Object.values(groupedPayments).forEach(({ siswa, payments }) => {
      sendPaymentNotification(
        siswa.waOrangTua,
        siswa.namaOrangTua,
        siswa.nama,
        siswa.kelas,
        payments,
        tanggal,
        state.profilSekolah.nama
      );
    });

    set((state) => ({
      tagihan: updatedTagihanLocal,
      akunKas: state.akunKas.map(a => a.id === akunId ? { ...a, saldo: a.saldo + totalNominal - diskon } : a),
      transaksi: [...state.transaksi, ...newTransaksi]
    }));
  },

  deleteTransaksi: async (id) => {
    const state = get();
    const tr = state.transaksi.find(t => t.id === id);
    if (!tr) return;

    const akun = state.akunKas.find(a => a.id === tr.akunId);
    let newSaldo = akun?.saldo || 0;
    if (akun) {
      newSaldo = tr.tipe === 'Pemasukan' ? akun.saldo - tr.nominal : akun.saldo + tr.nominal;
    }

    const tagihan = tr.tagihanId ? state.tagihan.find(t => t.id === tr.tagihanId) : null;
    let newTerbayar = tagihan?.terbayar || 0;
    if (tagihan) {
      newTerbayar = tagihan.terbayar - tr.nominal;
    }

    const promises: Promise<any>[] = [api.deleteRiwayatTransaksi(id)];
    if (akun) promises.push(api.updateAkunKas(akun.id, { saldo: newSaldo }));
    if (tagihan) promises.push(api.updateTagihanSiswa(tagihan.id, { terbayar: newTerbayar }));

    await Promise.all(promises);

    set((state) => ({
      transaksi: state.transaksi.filter(t => t.id !== id),
      akunKas: state.akunKas.map(a => a.id === tr.akunId ? { ...a, saldo: newSaldo } : a),
      tagihan: state.tagihan.map(t => t.id === tr.tagihanId ? { ...t, terbayar: newTerbayar } : t)
    }));
  },

  editTransaksi: async (id, data) => {
    const state = get();
    const oldTr = state.transaksi.find(t => t.id === id);
    if (!oldTr) return;

    const newTr = { ...oldTr, ...data };
    
    const oldAkun = state.akunKas.find(a => a.id === oldTr.akunId);
    const newAkun = state.akunKas.find(a => a.id === newTr.akunId);

    const oldTagihan = oldTr.tagihanId ? state.tagihan.find(t => t.id === oldTr.tagihanId) : null;
    const newTagihan = newTr.tagihanId ? state.tagihan.find(t => t.id === newTr.tagihanId) : null;

    // We can just recalculate in UI state, but for database, it's safer to just fetch everything after complex edit,
    // or calculate carefully. For simplicity, we just delete old and insert new, OR we can carefully update.
    // For local state:
    let updatedAkunKas = [...state.akunKas];
    let updatedTagihan = [...state.tagihan];

    // Revert old
    if (oldAkun) {
      const idx = updatedAkunKas.findIndex(a => a.id === oldAkun.id);
      updatedAkunKas[idx] = { ...updatedAkunKas[idx], saldo: oldTr.tipe === 'Pemasukan' ? updatedAkunKas[idx].saldo - oldTr.nominal : updatedAkunKas[idx].saldo + oldTr.nominal };
    }
    if (oldTagihan) {
      const idx = updatedTagihan.findIndex(t => t.id === oldTagihan.id);
      updatedTagihan[idx] = { ...updatedTagihan[idx], terbayar: updatedTagihan[idx].terbayar - oldTr.nominal };
    }

    // Apply new
    if (newAkun) {
      const idx = updatedAkunKas.findIndex(a => a.id === newAkun.id);
      // It might be same index, so find again from updated array
      const currentAkun = updatedAkunKas[idx];
      updatedAkunKas[idx] = { ...currentAkun, saldo: newTr.tipe === 'Pemasukan' ? currentAkun.saldo + newTr.nominal : currentAkun.saldo - newTr.nominal };
    }
    if (newTagihan) {
      const idx = updatedTagihan.findIndex(t => t.id === newTagihan.id);
      const currentTagihan = updatedTagihan[idx];
      updatedTagihan[idx] = { ...currentTagihan, terbayar: currentTagihan.terbayar + newTr.nominal };
    }

    // Supabase calls:
    const promises: Promise<any>[] = [api.updateRiwayatTransaksi(id, data)];
    if (oldAkun && newAkun && oldAkun.id === newAkun.id) {
      const finalAkun = updatedAkunKas.find(a => a.id === oldAkun.id);
      if (finalAkun) promises.push(api.updateAkunKas(finalAkun.id, { saldo: finalAkun.saldo }));
    } else {
      if (oldAkun) {
        const finalOldAkun = updatedAkunKas.find(a => a.id === oldAkun.id);
        if (finalOldAkun) promises.push(api.updateAkunKas(finalOldAkun.id, { saldo: finalOldAkun.saldo }));
      }
      if (newAkun) {
        const finalNewAkun = updatedAkunKas.find(a => a.id === newAkun.id);
        if (finalNewAkun) promises.push(api.updateAkunKas(finalNewAkun.id, { saldo: finalNewAkun.saldo }));
      }
    }

    if (oldTagihan && newTagihan && oldTagihan.id === newTagihan.id) {
       const finalTagihan = updatedTagihan.find(t => t.id === oldTagihan.id);
       if (finalTagihan) promises.push(api.updateTagihanSiswa(finalTagihan.id, { terbayar: finalTagihan.terbayar }));
    } else {
       if (oldTagihan) {
         const finalOldTagihan = updatedTagihan.find(t => t.id === oldTagihan.id);
         if (finalOldTagihan) promises.push(api.updateTagihanSiswa(finalOldTagihan.id, { terbayar: finalOldTagihan.terbayar }));
       }
       if (newTagihan) {
         const finalNewTagihan = updatedTagihan.find(t => t.id === newTagihan.id);
         if (finalNewTagihan) promises.push(api.updateTagihanSiswa(finalNewTagihan.id, { terbayar: finalNewTagihan.terbayar }));
       }
    }

    await Promise.all(promises);

    set({
      transaksi: state.transaksi.map(t => t.id === id ? (newTr as Transaksi) : t),
      akunKas: updatedAkunKas,
      tagihan: updatedTagihan
    });
  },

  addAdmin: async (data) => {
    const insertData = { ...data, id: generateId() };
    const res = await api.addPenggunaStafAdmin(insertData);
    if (res) set((state) => ({ admin: [...state.admin, insertData as Admin] }));
  },
  editAdmin: async (id, data) => {
    const res = await api.updatePenggunaStafAdmin(id, data);
    if (res) set((state) => ({ admin: state.admin.map(a => a.id === id ? { ...a, ...data } : a) }));
  },
  deleteAdmin: async (id) => {
    const res = await api.deletePenggunaStafAdmin(id);
    if (res) set((state) => ({ admin: state.admin.filter(a => a.id !== id) }));
  },
}));
