import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import ProdukPage from './pages/ProdukPage.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Navigate to="/produk" replace />} />
        <Route path="produk" element={<ProdukPage />} />
        <Route
          path="beranda"
          element={<PlaceholderPage judul="Beranda" />}
        />
        <Route
          path="transaksi"
          element={<PlaceholderPage judul="Transaksi" />}
        />
        <Route
          path="analitik-penjualan"
          element={<PlaceholderPage judul="Analitik Penjualan" />}
        />
        <Route
          path="rekomendasi-restock"
          element={<PlaceholderPage judul="Rekomendasi Restock" />}
        />
        <Route
          path="pengaturan"
          element={<PlaceholderPage judul="Pengaturan" />}
        />
        <Route path="*" element={<PlaceholderPage judul="Halaman tidak ditemukan" />} />
      </Route>
    </Routes>
  );
}
