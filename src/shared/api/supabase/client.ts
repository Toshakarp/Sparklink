import { createClient } from '@supabase/supabase-js';

// ============================================================================
// Конфигурация клиента Supabase
// ============================================================================
// Переменные окружения с префиксом VITE_ подставляются сборщиком Vite.
// Если переменные не указаны (например, при локальной разработке без .env),
// используются безопасные заглушки, чтобы предотвратить сбой при импорте.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

// Экземпляр клиента для выполнения запросов к базе данных Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


