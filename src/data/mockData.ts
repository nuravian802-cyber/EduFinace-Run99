export interface Siswa {
  id: string;
  nis: string;
  nisn: string;
  nama: string;
  kelas: string;
  namaOrangTua: string;
  waOrangTua: string;
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
  namaSiswa: string;
  namaTagihan: string;
  nominal: number;
  status: 'Belum Lunas' | 'Lunas';
  jatuhTempo: string;
}

export const mockSiswa: Siswa[] = [
  { id: '1', nis: '1001', nisn: '0051234567', nama: 'Budi Santoso', kelas: '10-A', namaOrangTua: 'Bpk. Santoso', waOrangTua: '081234567890' },
  { id: '2', nis: '1002', nisn: '0057654321', nama: 'Siti Aminah', kelas: '10-B', namaOrangTua: 'Ibu Aminah', waOrangTua: '081298765432' },
];

export const mockAkunKas: AkunKas[] = [
  { id: '1', kode: '1-100', nama: 'Kas Tunai', saldo: 15000000 },
  { id: '2', kode: '1-110', nama: 'Bank BCA', saldo: 90000000 },
];

export const mockKategori: Kategori[] = [
  { id: '1', tipe: 'Pemasukan', nama: 'SPP Bulanan' },
  { id: '2', tipe: 'Pemasukan', nama: 'Uang Gedung' },
  { id: '3', tipe: 'Pengeluaran', nama: 'Gaji Guru' },
  { id: '4', tipe: 'Pengeluaran', nama: 'Operasional Listrik' },
];

export const mockTagihan: Tagihan[] = [
  { id: '1', siswaId: '1', namaSiswa: 'Budi Santoso', namaTagihan: 'SPP Juli 2026', nominal: 500000, status: 'Belum Lunas', jatuhTempo: '2026-07-10' },
  { id: '2', siswaId: '2', namaSiswa: 'Siti Aminah', namaTagihan: 'SPP Juli 2026', nominal: 500000, status: 'Lunas', jatuhTempo: '2026-07-10' },
];
