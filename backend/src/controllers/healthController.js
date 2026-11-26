export function createHealthController(repo) {
  return {
    async getHealth(_req, res) {
      const dbStatus = await repo.checkHealth();
      res.status(200).json({
        success: true,
        message: 'RoyalStore Backend API berjalan normal.',
        data: {
          service: 'royalstore-backend',
          timestamp: new Date().toISOString(),
          storage: dbStatus,
        },
      });
    },
  };
}
