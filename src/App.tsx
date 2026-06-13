import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './views/Dashboard';
import DataSiswa from './views/DataSiswa';
import TagihanSiswa from './views/TagihanSiswa';
import AkunKas from './views/AkunKas';
import PosKategori from './views/PosKategori';
import TransaksiPembayaran from './views/TransaksiPembayaran';
import PendapatanLain from './views/PendapatanLain';
import Pengeluaran from './views/Pengeluaran';
import RiwayatTransaksi from './views/RiwayatTransaksi';
import BukuBesar from './views/BukuBesar';
import ArusKas from './views/ArusKas';
import StafAdmin from './views/StafAdmin';
import AkunSiswa from './views/AkunSiswa';
import Pengaturan from './views/Pengaturan';
import Login from './views/Login';
import { useStore } from './store/useStore';
import './App.css';

const App: React.FC = () => {
  const { currentUser, fetchDataAwal, isInitialized } = useStore();

  useEffect(() => {
    fetchDataAwal();
  }, [fetchDataAwal]);

  if (!isInitialized) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Memuat data...</div>;
  }

  if (!currentUser) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Dashboard */}
          <Route index element={currentUser?.role === 'Siswa' ? <Navigate to="/master/tagihan" replace /> : <Dashboard />} />
          
          {/* Master Data */}
          <Route path="master/akun-kas" element={<AkunKas />} />
          <Route path="master/siswa" element={<DataSiswa />} />
          <Route path="master/tagihan" element={<TagihanSiswa />} />
          <Route path="master/kategori" element={<PosKategori />} />
          
          {/* Transaksi */}
          <Route path="transaksi/pembayaran" element={<TransaksiPembayaran />} />
          <Route path="transaksi/pendapatan" element={<PendapatanLain />} />
          <Route path="transaksi/pengeluaran" element={<Pengeluaran />} />
          <Route path="transaksi/riwayat" element={<RiwayatTransaksi />} />
          
          {/* Laporan */}
          <Route path="laporan/buku-besar" element={<BukuBesar />} />
          <Route path="laporan/arus-kas" element={<ArusKas />} />
          
          {/* System */}
          <Route path="sistem/staf-admin" element={<StafAdmin />} />
          <Route path="sistem/akun-siswa" element={<AkunSiswa />} />
          <Route path="pengaturan" element={<Pengaturan />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
