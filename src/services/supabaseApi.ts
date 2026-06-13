import { supabase } from '../utils/supabaseClient';

// Helper to handle errors uniformly
const handleResponse = (data: any, error: any, context: string) => {
  if (error) {
    console.error(`Error in ${context}:`, error);
    return null;
  }
  return data;
};

// ==========================================
// Akun_Kas
// ==========================================
export const getAkunKas = async () => {
  const { data, error } = await supabase.from('Akun_Kas').select('*');
  return handleResponse(data, error, 'getAkunKas');
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
  const { data, error } = await supabase.from('data_siswa_lengkap').select('*');
  return handleResponse(data, error, 'getDataSiswaLengkap');
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
  const { data, error } = await supabase
    .from('data_siswa_lengkap')
    .update({ kelas: kelasTujuan })
    .eq('kelas', kelasAsal)
    .select();
  return handleResponse(data, error, 'updateKelasMassalSiswa');
};

// ==========================================
// pengguna_stafadmin
// ==========================================
export const getPenggunaStafAdmin = async () => {
  const { data, error } = await supabase.from('pengguna_stafadmin').select('*');
  return handleResponse(data, error, 'getPenggunaStafAdmin');
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
  const { data, error } = await supabase.from('pos_kategori').select('*');
  return handleResponse(data, error, 'getPosKategori');
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
// riwayat_transaksi
// ==========================================
export const getRiwayatTransaksi = async () => {
  const { data, error } = await supabase.from('riwayat_transaksi').select('*');
  return handleResponse(data, error, 'getRiwayatTransaksi');
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
  const { data, error } = await supabase.from('tagihan_siswa').select('*');
  return handleResponse(data, error, 'getTagihanSiswa');
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
