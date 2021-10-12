import pg from 'pg'

import * as db from 'zapatos/db'
import type * as s from 'zapatos/schema'
import debug from 'debug'
import { customAlphabet } from 'nanoid'
const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
// https://zelark.github.io/nano-id-cc/
export const makeId = customAlphabet(alphabet, 13)

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

db.setConfig({
  castArrayParamsToJson: true,
  castObjectParamsToJson: true
})

if (process.env.NODE_ENV === 'development') {
  db.setConfig({
    queryListener: debug('sql.query'),
    resultListener: debug('sql.result'),
    transactionListener: debug('sql.transaction')
  })
}

const dc = db.conditions
export { db, pool, dc }
export type { s }

// FIX: use JSONSelectable from Zapatos when available
export type JSONSelectableForTable<T extends s.Table> = {
  [K in keyof s.SelectableForTable<T>]: Date extends s.SelectableForTable<T>[K]
    ? Exclude<s.SelectableForTable<T>[K], Date> | db.DateString
    : Date[] extends s.SelectableForTable<T>[K]
    ? Exclude<s.SelectableForTable<T>[K], Date[]> | db.DateString[]
    : s.SelectableForTable<T>[K]
}

// FIX: use provided client to share transaction
export async function updateExactlyOne<T extends s.Table>(
  table: T,
  update: s.UpdatableForTable<T>,
  where: s.WhereableForTable<T>,
  opts?: {
    // update row if it's in desired state only
    check?: (row: JSONSelectableForTable<T>) => boolean
    client?: typeof pool | db.TxnClientForSerializable
  }
): Promise<JSONSelectableForTable<T> | undefined> {
  // @ts-ignore
  return db.serializable(opts?.client || pool, async (txn) => {
    const row = (await db
      .selectExactlyOne(table, where)
      .run(txn)) as unknown as JSONSelectableForTable<T>
    if (opts?.check && !opts.check(row)) return
    const [updatedRow] = await db.update(table, update, where).run(txn)
    // FIX: check number of returned rows
    return updatedRow
  })
}

export async function selectExactlyOnePublic<T extends s.Table>(
  table: T,
  where: s.WhereableForTable<T>,
  opts: {
    txn?: db.TxnClientForSerializable
  } = {}
): Promise<JSONSelectableForTable<T> | undefined> {
  const row = await db.selectExactlyOne(table, where).run(opts.txn || pool)
  // @ts-ignore
  if (!row.isPublic) throw new Error(`Object is not public: ${row.id}.`)
  return row as unknown as JSONSelectableForTable<T>
}
