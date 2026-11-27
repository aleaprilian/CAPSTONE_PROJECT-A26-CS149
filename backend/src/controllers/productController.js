import {
  parsePositiveIntId,
  validateCreateProductPayload,
  validateUpdateProductPayload,
} from '../utils/productValidation.js';

export function createProductController(repo) {
  return {
    async listProducts(req, res) {
      const result = await repo.listProducts(req.query);
      res.status(200).json({
        success: true,
        data: result.items,
        meta: result.meta,
      });
    },

    async getProductById(req, res) {
      const id = parsePositiveIntId(req.params.id, 'ID produk');
      const product = await repo.getProductById(id);
      res.status(200).json({
        success: true,
        data: product,
      });
    },

    async createProduct(req, res) {
      const payload = validateCreateProductPayload(req.body);
      const created = await repo.createProduct(payload);
      res.status(201).json({
        success: true,
        message: 'Produk berhasil ditambahkan.',
        data: created,
      });
    },

    async updateProduct(req, res) {
      const id = parsePositiveIntId(req.params.id, 'ID produk');
      const updates = validateUpdateProductPayload(req.body);
      const updated = await repo.updateProduct(id, updates);
      res.status(200).json({
        success: true,
        message: 'Produk berhasil diperbarui.',
        data: updated,
      });
    },

    async deleteProduct(req, res) {
      const id = parsePositiveIntId(req.params.id, 'ID produk');
      const deleted = await repo.deleteProduct(id);
      res.status(200).json({
        success: true,
        message: `Produk "${deleted.nama_produk}" berhasil dihapus.`,
        data: deleted,
      });
    },
  };
}
