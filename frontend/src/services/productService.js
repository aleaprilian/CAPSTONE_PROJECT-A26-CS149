import { mockProducts } from '../data/mockProducts.js';

// Titik pergantian ke REST API nanti. Saat ini mengembalikan data contoh.
// Contoh saat backend siap:
//   import api from './api.js';
//   const { data } = await api.get('/products');
//   return data;
export async function getProducts() {
  return mockProducts;
}
