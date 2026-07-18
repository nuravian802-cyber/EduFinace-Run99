import { supabase } from '../utils/supabaseClient';

// Helper to handle errors uniformly
const handleResponse = (data: any, error: any, context: string) => {
  if (error) {
    console.error(`Error in ${context}:`, error);
    return null;
  }
  return data;
};

// Helper to fetch all rows using pagination (bypass 1000 limit)
const fetchAllRows = async (tableName: string) => {
  let allData: any[] = [];
  let from = 0;
  const step = 1000;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .range(from, from + step - 1);
    
    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      return null;
    }
    
    if (data) {
      allData = [...allData, ...data];
      from += step;
      if (data.length < step) hasMore = false;
    } else {
      hasMore = false;
    }
  }
  return allData;
};

// ==========================================
// Akun_Kas
// ==========================================
export const getAkunKas = async () => {
  return await fetchAllRows('Akun_Kas');
};

export const addAkunKas = async (insertData: any) => {
  const { data, error } = await supabase.from('Akun_Kas').insert([insertData]).select();
  return handleResponse(data, error, 'addAkunKas');
};

export const updateAkunKas = async (id: string, updateData: any) => {
  const { data, error } = await supabase.from('Akun_Kas').update(updateData).eq('id', id).select();
  return handleResponse(data, error, 'updateAkunKas');
};

export const deleteAkunKas = async (id: string) => {
  const { data, error } = await supabase.from('Akun_Kas').delete().eq('id', id).select();
  return handleResponse(data, error, 'deleteAkunKas');
};

// ==========================================
// data_siswa_lengkap
// ==========================================
export const getDataSiswaLengkap = async () => {
  return await fetchAllRows('data_siswa_lengkap');
};

export const addDataSiswaLengkap = async (insertData: any) => {
  const { data, error } = await supabase.from('data_siswa_lengkap').insert([insertData]).select();
  return handleResponse(data, error, 'addDataSiswaLengkap');
};

export const updateDataSiswaLengkap = async (id: string, updateData: any) => {
  const { data, error } = await supabase.from('data_siswa_lengkap').update(updateData).eq('id', id).select();
  return handleResponse(data, error, 'updateDataSiswaLengkap');
};

export const deleteDataSiswaLengkap = async (id: string) => {
  const { data, error } = await supabase.from('data_siswa_lengkap').delete().eq('id', id).select();
  return handleResponse(data, error, 'deleteDataSiswaLengkap');
};

export const updateKelasMassalSiswa = async (kelasAsal: string, kelasTujuan: string) => {
  const isLulus = kelasTujuan.toLowerCase() === 'lulus';
  const updateData: any = { kelas: kelasTujuan };
  if (isLulus) {
    updateData.status = 'Non-aktif';
  }

  const { data, error } = await supabase
    .from('data_siswa_lengkap')
    .update(updateData)
    .eq('kelas', kelasAsal)
    .select();
  return handleResponse(data, error, 'updateKelasMassalSiswa');
};

// ==========================================
// pengguna_stafadmin
// ==========================================
export const getPenggunaStafAdmin = async () => {
  return await fetchAllRows('pengguna_stafadmin');
};

export const addPenggunaStafAdmin = async (insertData: any) => {
  const { data, error } = await supabase.from('pengguna_stafadmin').insert([insertData]).select();
  return handleResponse(data, error, 'addPenggunaStafAdmin');
};

export const updatePenggunaStafAdmin = async (id: string, updateData: any) => {
  const { data, error } = await supabase.from('pengguna_stafadmin').update(updateData).eq('id', id).select();
  return handleResponse(data, error, 'updatePenggunaStafAdmin');
};

export const deletePenggunaStafAdmin = async (id: string) => {
  const { data, error } = await supabase.from('pengguna_stafadmin').delete().eq('id', id).select();
  return handleResponse(data, error, 'deletePenggunaStafAdmin');
};

// ==========================================
// pos_kategori
// ==========================================
export const getPosKategori = async () => {
  return await fetchAllRows('pos_kategori');
};

export const addPosKategori = async (insertData: any) => {
  const { data, error } = await supabase.from('pos_kategori').insert([insertData]).select();
  return handleResponse(data, error, 'addPosKategori');
};

export const updatePosKategori = async (id: string, updateData: any) => {
  const { data, error } = await supabase.from('pos_kategori').update(updateData).eq('id', id).select();
  return handleResponse(data, error, 'updatePosKategori');
};

export const deletePosKategori = async (id: string) => {
  const { data, error } = await supabase.from('pos_kategori').delete().eq('id', id).select();
  return handleResponse(data, error, 'deletePosKategori');
};

// ==========================================
// pos_tagihan
// ==========================================
export const getPosTagihan = async () => {
  const rows = await fetchAllRows('pos_tagihan');
  if (!rows) return null;
  return rows.map(r => ({
    id: r.id,
    namaTagihan: r.nama_tagihan,
    nominal: r.nominal
  }));
};

export const addPosTagihan = async (insertData: any) => {
  const dbData = { id: insertData.id, nama_tagihan: insertData.namaTagihan, nominal: insertData.nominal };
  const { data, error } = await supabase.from('pos_tagihan').insert([dbData]).select();
  return handleResponse(data, error, 'addPosTagihan');
};

export const updatePosTagihan = async (id: string, updateData: any) => {
  const dbData: any = {};
  if (updateData.namaTagihan !== undefined) dbData.nama_tagihan = updateData.namaTagihan;
  if (updateData.nominal !== undefined) dbData.nominal = updateData.nominal;
  
  const { data, error } = await supabase.from('pos_tagihan').update(dbData).eq('id', id).select();
  return handleResponse(data, error, 'updatePosTagihan');
};

export const deletePosTagihan = async (id: string) => {
  const { data, error } = await supabase.from('pos_tagihan').delete().eq('id', id).select();
  return handleResponse(data, error, 'deletePosTagihan');
};

// ==========================================
// riwayat_transaksi
// ==========================================
export const getRiwayatTransaksi = async () => {
  return await fetchAllRows('riwayat_transaksi');
};

export const addRiwayatTransaksi = async (insertData: any) => {
  const { data, error } = await supabase.from('riwayat_transaksi').insert([insertData]).select();
  return handleResponse(data, error, 'addRiwayatTransaksi');
};

export const updateRiwayatTransaksi = async (id: string, updateData: any) => {
  const { data, error } = await supabase.from('riwayat_transaksi').update(updateData).eq('id', id).select();
  return handleResponse(data, error, 'updateRiwayatTransaksi');
};

export const deleteRiwayatTransaksi = async (id: string) => {
  const { data, error } = await supabase.from('riwayat_transaksi').delete().eq('id', id).select();
  return handleResponse(data, error, 'deleteRiwayatTransaksi');
};

// ==========================================
// tagihan_siswa
// ==========================================
export const getTagihanSiswa = async () => {
  return await fetchAllRows('tagihan_siswa');
};

export const addTagihanSiswa = async (insertData: any) => {
  const { data, error } = await supabase.from('tagihan_siswa').insert([insertData]).select();
  return handleResponse(data, error, 'addTagihanSiswa');
};

export const updateTagihanSiswa = async (id: string, updateData: any) => {
  const { data, error } = await supabase.from('tagihan_siswa').update(updateData).eq('id', id).select();
  return handleResponse(data, error, 'updateTagihanSiswa');
};

export const deleteTagihanSiswa = async (id: string) => {
  const { data, error } = await supabase.from('tagihan_siswa').delete().eq('id', id).select();
  return handleResponse(data, error, 'deleteTagihanSiswa');
};

// ==========================================
// profil_sekolah
// ==========================================
export const getProfilSekolah = async () => {
  const { data, error } = await supabase.from('profil_sekolah').select('*').limit(1);
  if (error) {
    console.error('Error fetching profil_sekolah:', error);
    return null;
  }
  return data && data.length > 0 ? data[0] : null;
};

export const updateProfilSekolah = async (id: string, updateData: any) => {
  const { data, error } = await supabase.from('profil_sekolah').update(updateData).eq('id', id).select();
  return handleResponse(data, error, 'updateProfilSekolah');
};

// Bulk insert for tagihan massal
export const addTagihanSiswaMassal = async (insertDataArray: any[]) => {
  const { data, error } = await supabase.from('tagihan_siswa').insert(insertDataArray).select();
  return handleResponse(data, error, 'addTagihanSiswaMassal');
};

export const addRiwayatTransaksiMassal = async (insertDataArray: any[]) => {
  const { data, error } = await supabase.from('riwayat_transaksi').insert(insertDataArray).select();
  return handleResponse(data, error, 'addRiwayatTransaksiMassal');
};

// ==========================================
// riwayat_login
// ==========================================
export const getRiwayatLogin = async () => {
  const { data, error } = await supabase
    .from('riwayat_login')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  return handleResponse(data, error, 'getRiwayatLogin');
};

export const addRiwayatLogin = async (insertData: any) => {
  const { data, error } = await supabase.from('riwayat_login').insert([insertData]).select();
  return handleResponse(data, error, 'addRiwayatLogin');
};
