import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../store/useStore';

const Dashboard: React.FC = () => {
  const { transaksi, akunKas, siswa, profilSekolah } = useStore();

  const dbData = { kas: akunKas, siswa: siswa };
  const isLoadingDb = false;

  const totalMasuk = useMemo(() => 
    transaksi.filter(t => t.tipe === 'Pemasukan').reduce((sum, t) => sum + t.nominal, 0)
  , [transaksi]);

  const totalKeluar = useMemo(() => 
    transaksi.filter(t => t.tipe === 'Pengeluaran').reduce((sum, t) => sum + t.nominal, 0)
  , [transaksi]);

  const saldoAkhir = useMemo(() => 
    akunKas.reduce((sum, a) => sum + a.saldo, 0)
  , [akunKas]);

  // Aggregate data by month for the chart
  const chartData = useMemo(() => {
    const monthlyData: Record<string, { name: string, masuk: number, keluar: number }> = {};
    
    // Initialize months (Jan - Dec 2026 for demo purposes, or based on current year)
    const currentYear = new Date().getFullYear();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    
    monthNames.forEach((m, idx) => {
      const monthKey = `${currentYear}-${String(idx + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = { name: m, masuk: 0, keluar: 0 };
    });

    transaksi.forEach(t => {
      const monthKey = t.tanggal.substring(0, 7); // e.g. "2026-07"
      if (monthlyData[monthKey]) {
        if (t.tipe === 'Pemasukan') {
          monthlyData[monthKey].masuk += t.nominal;
        } else {
          monthlyData[monthKey].keluar += t.nominal;
        }
      }
    });

    return Object.values(monthlyData);
  }, [transaksi]);

  return (
    <div className="animate-fade-in">
      <div className="mb-4" style={{ marginBottom: '2rem' }}>
        <h2>Dashboard</h2>
        <p>Ringkasan Keuangan {profilSekolah?.nama || 'EduFinance'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <p className="form-label" style={{ marginBottom: '0.25rem' }}>Total Kas Masuk (Semua Waktu)</p>
          <h3 style={{ color: 'var(--success)' }}>Rp {totalMasuk.toLocaleString('id-ID')}</h3>
        </div>
        <div className="card">
          <p className="form-label" style={{ marginBottom: '0.25rem' }}>Total Kas Keluar (Semua Waktu)</p>
          <h3 style={{ color: 'var(--danger)' }}>Rp {totalKeluar.toLocaleString('id-ID')}</h3>
        </div>
        <div className="card">
          <p className="form-label" style={{ marginBottom: '0.25rem' }}>Saldo Kas Bersih</p>
          <h3 style={{ color: 'var(--primary)' }}>Rp {saldoAkhir.toLocaleString('id-ID')}</h3>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Grafik Arus Kas (Tahun Ini)</h3>
        <div style={{ height: '350px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#01B574" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#01B574" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EE5D50" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EE5D50" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A3AED0' }} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#A3AED0' }}
                tickFormatter={(value) => value >= 1000000 ? `Rp ${value / 1000000}M` : `Rp ${value}`}
              />
              <Tooltip 
                formatter={(value: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)}
              />
              <Area type="monotone" dataKey="masuk" name="Kas Masuk" stroke="#01B574" fillOpacity={1} fill="url(#colorMasuk)" />
              <Area type="monotone" dataKey="keluar" name="Kas Keluar" stroke="#EE5D50" fillOpacity={1} fill="url(#colorKeluar)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Data Akun Kas (Supabase)</h3>
        {isLoadingDb ? (
          <p>Memuat data...</p>
        ) : dbData.kas.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  {Object.keys(dbData.kas[0]).slice(0, 6).map((key) => (
                    <th key={key} style={{ padding: '0.75rem 0.5rem', textTransform: 'capitalize' }}>
                      {key.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dbData.kas.slice(0, 5).map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    {Object.keys(dbData.kas[0]).slice(0, 6).map((key) => (
                      <td key={key} style={{ padding: '0.75rem 0.5rem' }}>
                        {String(row[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {dbData.kas.length > 5 && <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Menampilkan 5 data pertama.</p>}
          </div>
        ) : (
          <p>Tidak ada data Akun Kas di database.</p>
        )}
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Data Siswa (Supabase)</h3>
        {isLoadingDb ? (
          <p>Memuat data...</p>
        ) : dbData.siswa.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  {Object.keys(dbData.siswa[0]).slice(0, 6).map((key) => (
                    <th key={key} style={{ padding: '0.75rem 0.5rem', textTransform: 'capitalize' }}>
                      {key.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dbData.siswa.slice(0, 5).map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    {Object.keys(dbData.siswa[0]).slice(0, 6).map((key) => (
                      <td key={key} style={{ padding: '0.75rem 0.5rem' }}>
                        {String(row[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {dbData.siswa.length > 5 && <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Menampilkan 5 data pertama.</p>}
          </div>
        ) : (
          <p>Tidak ada data Siswa di database.</p>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
