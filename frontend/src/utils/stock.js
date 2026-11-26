// Ambang batas status stok (sesuai catatan di desain: dapat diubah di Pengaturan nanti).
export const BATAS_MENIPIS = 3;

export const STATUS_STOK = {
  HABIS: 'habis',
  MENIPIS: 'menipis',
  TERSEDIA: 'tersedia',
};

export function getStatusStok(stok) {
  if (stok <= 0) return STATUS_STOK.HABIS;
  if (stok <= BATAS_MENIPIS) return STATUS_STOK.MENIPIS;
  return STATUS_STOK.TERSEDIA;
}
