import dotenv from 'dotenv';

dotenv.config();

export function getEnvConfig() {
  const port = Number.parseInt(process.env.PORT || '3000', 10);
  const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
  const supabaseServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const requestedMode = (process.env.STORAGE_MODE || 'auto').trim().toLowerCase();

  let storageMode = 'memory';
  if (requestedMode === 'supabase') {
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error(
        'STORAGE_MODE=supabase membutuhkan SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di .env.',
      );
    }
    storageMode = 'supabase';
  } else if (requestedMode === 'auto' && supabaseUrl && supabaseServiceRoleKey) {
    storageMode = 'supabase';
  }

  return {
    port: Number.isNaN(port) ? 3000 : port,
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigins,
    storageMode,
    supabaseUrl,
    supabaseServiceRoleKey,
  };
}
