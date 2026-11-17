#!/usr/bin/env node
/**
 * Ganti URL Supabase Storage -> URL Worker cache di SEMUA kolom teks/json
 * database (termasuk isi artikel / deskripsi). Default = DRY-RUN.
 *
 *   node tools/rewrite-asset-urls.mjs            # simulasi (aman)
 *   node tools/rewrite-asset-urls.mjs --apply    # ubah database
 *   node tools/rewrite-asset-urls.mjs --revert --apply   # kembalikan ke URL Supabase
 *
 * Env wajib:
 *   DATABASE_URL     connection string "Session pooler" Supabase
 *   SUPABASE_URL     contoh https://nvigwjlejzggkfqjqnxs.supabase.co
 *   ASSETS_BASE_URL  contoh https://awang-assets.<akun>.workers.dev
 *
 * Instalasi (di folder terpisah atau npx):  npm i pg
 * BACKUP DATABASE DULU sebelum --apply.
 */
import pg from 'pg';

const apply = process.argv.includes('--apply');
const revert = process.argv.includes('--revert');
const { DATABASE_URL, SUPABASE_URL, ASSETS_BASE_URL } = process.env;
if (!DATABASE_URL || !SUPABASE_URL || !ASSETS_BASE_URL) {
  console.error('Isi env: DATABASE_URL, SUPABASE_URL, ASSETS_BASE_URL');
  process.exit(1);
}

const supabasePrefix = `${SUPABASE_URL.replace(/\/+$/, '')}/storage/v1/object/public/`;
const workerPrefix = `${ASSETS_BASE_URL.replace(/\/+$/, '')}/public/`;
const [from, to] = revert ? [workerPrefix, supabasePrefix] : [supabasePrefix, workerPrefix];

const quote = (s) => `"${String(s).replace(/"/g, '""')}"`;
const ssl = /sslmode=disable/.test(DATABASE_URL) ? false : { rejectUnauthorized: false };
const client = new pg.Client({ connectionString: DATABASE_URL, ssl });
await client.connect();

try {
  const { rows: columns } = await client.query(`
    select c.table_name, c.column_name, c.data_type
    from information_schema.columns c
    join information_schema.tables t
      on t.table_schema = c.table_schema and t.table_name = c.table_name
    where c.table_schema = 'public' and t.table_type = 'BASE TABLE'
      and c.data_type in ('text', 'character varying', 'json', 'jsonb')
    order by c.table_name, c.column_name`);

  console.log(`${apply ? 'APPLY' : 'DRY-RUN'}${revert ? ' (revert)' : ''}: ${from} -> ${to}\n`);
  if (apply) await client.query('begin');
  let total = 0;
  for (const col of columns) {
    const column = quote(col.column_name);
    const table = `public.${quote(col.table_name)}`;
    const castBack = col.data_type === 'jsonb' ? '::jsonb' : col.data_type === 'json' ? '::json' : '';
    const expr = `replace(${column}::text, $1, $2)`;
    const where = `${column}::text like '%' || $1 || '%'`;
    let n;
    if (apply) {
      n = (await client.query(`update ${table} set ${column} = (${expr})${castBack} where ${where}`, [from, to])).rowCount;
    } else {
      n = (await client.query(`select count(*)::int as n from ${table} where ${where}`, [from, to])).rows[0].n;
    }
    if (n > 0) {
      total += n;
      console.log(`  ${col.table_name}.${col.column_name}: ${n} baris`);
    }
  }
  if (apply) await client.query('commit');
  console.log(`\nTotal ${total} baris ${apply ? 'diubah' : 'akan diubah'}.`);
  if (!apply) console.log('Ini simulasi. Tambahkan --apply untuk mengubah.');
} catch (e) {
  if (apply) await client.query('rollback');
  console.error(e);
  process.exitCode = 1;
} finally {
  await client.end();
}
