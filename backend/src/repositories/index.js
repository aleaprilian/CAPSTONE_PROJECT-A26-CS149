import { createSupabaseClient } from '../config/supabase.js';
import { createMemoryProductRepository } from './memoryProductRepository.js';
import { createSupabaseProductRepository } from './supabaseProductRepository.js';

export function createRepositoryFromEnv(config) {
  if (config.storageMode === 'supabase') {
    const supabase = createSupabaseClient(config.supabaseUrl, config.supabaseServiceRoleKey);
    return createSupabaseProductRepository(supabase);
  }
  return createMemoryProductRepository();
}
