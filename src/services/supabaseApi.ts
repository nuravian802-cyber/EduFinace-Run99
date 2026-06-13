import { supabase } from '../utils/supabaseClient';

// ==========================================
// Akun_Kas
// ==========================================
export const getAkunKas = async () => {
  try {
    const { data, error } = await supabase.from('Akun_Kas').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching Akun_Kas:', error);
    return null;
  }
};

export const addAkunKas = async (insertData: any) => {
  try {
    const { data, error } = await supabase.from('Akun_Kas').insert([insertData]).select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error inserting Akun_Kas:', error);
    return null;
  }
};

export const deleteAkunKas = async (id: string | number) => {
  try {
    const { data, error } = await supabase.from('Akun_Kas').delete().eq('id', id).select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting Akun_Kas:', error);
    return null;
  }
};

// ==========================================
// data_siswa_lengkap
// ==========================================
export const getDataSiswaLengkap = async () => {
  try {
    const { data, error } = await supabase.from('data_siswa_lengkap').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching data_siswa_lengkap:', error);
    return null;
  }
};

export const addDataSiswaLengkap = async (insertData: any) => {
  try {
    const { data, error } = await supabase.from('data_siswa_lengkap').insert([insertData]).select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error inserting data_siswa_lengkap:', error);
    return null;
  }
};

export const deleteDataSiswaLengkap = async (id: string | number) => {
  try {
    const { data, error } = await supabase.from('data_siswa_lengkap').delete().eq('id', id).select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting data_siswa_lengkap:', error);
    return null;
  }
};

// ==========================================
// pengguna_akunsiswa
// ==========================================
export const getPenggunaAkunSiswa = async () => {
  try {
    const { data, error } = await supabase.from('pengguna_akunsiswa').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching pengguna_akunsiswa:', error);
    return null;
  }
};

export const addPenggunaAkunSiswa = async (insertData: any) => {
  try {
    const { data, error } = await supabase.from('pengguna_akunsiswa').insert([insertData]).select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error inserting pengguna_akunsiswa:', error);
    return null;
  }
};

export const deletePenggunaAkunSiswa = async (id: string | number) => {
  try {
    const { data, error } = await supabase.from('pengguna_akunsiswa').delete().eq('id', id).select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting pengguna_akunsiswa:', error);
    return null;
  }
};

// ==========================================
// pengguna_stafadmin
// ==========================================
export const getPenggunaStafAdmin = async () => {
  try {
    const { data, error } = await supabase.from('pengguna_stafadmin').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching pengguna_stafadmin:', error);
    return null;
  }
};

export const addPenggunaStafAdmin = async (insertData: any) => {
  try {
    const { data, error } = await supabase.from('pengguna_stafadmin').insert([insertData]).select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error inserting pengguna_stafadmin:', error);
    return null;
  }
};

export const deletePenggunaStafAdmin = async (id: string | number) => {
  try {
    const { data, error } = await supabase.from('pengguna_stafadmin').delete().eq('id', id).select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting pengguna_stafadmin:', error);
    return null;
  }
};

// ==========================================
// pos_kategori
// ==========================================
export const getPosKategori = async () => {
  try {
    const { data, error } = await supabase.from('pos_kategori').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching pos_kategori:', error);
    return null;
  }
};

export const addPosKategori = async (insertData: any) => {
  try {
    const { data, error } = await supabase.from('pos_kategori').insert([insertData]).select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error inserting pos_kategori:', error);
    return null;
  }
};

export const deletePosKategori = async (id: string | number) => {
  try {
    const { data, error } = await supabase.from('pos_kategori').delete().eq('id', id).select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting pos_kategori:', error);
    return null;
  }
};

// ==========================================
// riwayat_transaksi
// ==========================================
export const getRiwayatTransaksi = async () => {
  try {
    const { data, error } = await supabase.from('riwayat_transaksi').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching riwayat_transaksi:', error);
    return null;
  }
};

export const addRiwayatTransaksi = async (insertData: any) => {
  try {
    const { data, error } = await supabase.from('riwayat_transaksi').insert([insertData]).select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error inserting riwayat_transaksi:', error);
    return null;
  }
};

export const deleteRiwayatTransaksi = async (id: string | number) => {
  try {
    const { data, error } = await supabase.from('riwayat_transaksi').delete().eq('id', id).select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting riwayat_transaksi:', error);
    return null;
  }
};

// ==========================================
// tagihan_siswa
// ==========================================
export const getTagihanSiswa = async () => {
  try {
    const { data, error } = await supabase.from('tagihan_siswa').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching tagihan_siswa:', error);
    return null;
  }
};

export const addTagihanSiswa = async (insertData: any) => {
  try {
    const { data, error } = await supabase.from('tagihan_siswa').insert([insertData]).select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error inserting tagihan_siswa:', error);
    return null;
  }
};

export const deleteTagihanSiswa = async (id: string | number) => {
  try {
    const { data, error } = await supabase.from('tagihan_siswa').delete().eq('id', id).select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting tagihan_siswa:', error);
    return null;
  }
};
