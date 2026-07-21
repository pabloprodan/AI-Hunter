import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { DrizzleStore } from './drizzle-store';

export { schema, DrizzleStore };

export function createDb(path: string) {
  const client = createClient({ url: `file:${path}` });
  return drizzle(client, { schema });
}
