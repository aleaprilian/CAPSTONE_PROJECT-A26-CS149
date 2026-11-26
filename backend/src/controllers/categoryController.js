export function createCategoryController(repo) {
  return {
    async listCategories(_req, res) {
      const categories = await repo.listCategories();
      res.status(200).json({
        success: true,
        data: categories,
        meta: { total: categories.length },
      });
    },
  };
}
