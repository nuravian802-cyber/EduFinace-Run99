import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  WalletCards, 
  FileText, 
  Settings,
  Users,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  UserCog,
  Key
} from 'lucide-react';
import { useStore } from '../store/useStore';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { currentUser } = useStore();
  const isKepsek = currentUser?.role === 'Kepala Sekolah';
  const isSiswa = currentUser?.role === 'Siswa';
  const isAdmin = currentUser?.role === 'Super Admin';

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo-icon">EF</div>
        <h2>EduFinance</h2>
      </div>

      <nav className="sidebar-nav">
        {!isSiswa && (
        <div className="nav-section">
          <span className="nav-section-title">MAIN MENU</span>
          <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} end>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
        </div>
        )}

        {isSiswa && (
          <div className="nav-section">
            <span className="nav-section-title">INFORMASI SISWA</span>
            <NavLink to="/master/tagihan" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <CreditCard size={20} />
              <span>Tagihan Saya</span>
            </NavLink>
          </div>
        )}

        {!isKepsek && !isSiswa && (
          <div className="nav-section">
            <span className="nav-section-title">MASTER DATA</span>
          <NavLink to="/master/akun-kas" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <WalletCards size={20} />
            <span>Akun Kas</span>
          </NavLink>
          <NavLink to="/master/siswa" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            <span>Data Siswa</span>
          </NavLink>
          <NavLink to="/master/tagihan" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <CreditCard size={20} />
            <span>Tagihan Siswa</span>
          </NavLink>
          <NavLink to="/master/kategori" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Database size={20} />
            <span>Pos Kategori</span>
          </NavLink>
        </div>
        )}

        {!isKepsek && !isSiswa && (
        <div className="nav-section">
          <span className="nav-section-title">TRANSAKSI</span>
          <NavLink to="/transaksi/pembayaran" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <ArrowDownCircle size={20} className="text-success" />
            <span>Bayar Siswa</span>
          </NavLink>
          <NavLink to="/transaksi/pendapatan" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <ArrowDownCircle size={20} className="text-success" />
            <span>Pendapatan Lain</span>
          </NavLink>
          <NavLink to="/transaksi/pengeluaran" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <ArrowUpCircle size={20} className="text-danger" />
            <span>Pengeluaran</span>
          </NavLink>
        </div>
        )}

        {!isSiswa && (
        <div className="nav-section">
          <span className="nav-section-title">REPORTING</span>
          <NavLink to="/laporan/buku-besar" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <FileText size={20} />
            <span>Buku Besar</span>
          </NavLink>
          <NavLink to="/laporan/arus-kas" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <FileText size={20} />
            <span>Arus Kas</span>
          </NavLink>
        </div>
        )}

        {!isKepsek && !isSiswa && (
        <div className="nav-section">
          <span className="nav-section-title">SYSTEM</span>
          <NavLink to="/sistem/staf-admin" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <UserCog size={20} />
            <span>Staf Admin</span>
          </NavLink>
          <NavLink to="/sistem/akun-siswa" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Key size={20} />
            <span>Akun Siswa</span>
          </NavLink>
          <NavLink to="/pengaturan" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={20} />
            <span>Pengaturan</span>
          </NavLink>
        </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
