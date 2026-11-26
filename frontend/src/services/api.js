import axios from 'axios';

// Placeholder konfigurasi Axios untuk tahap integrasi backend.
// Belum dipakai di Minggu 1: halaman masih membaca data contoh dari src/data.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
