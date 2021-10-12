import { Cursor } from '~/types'
import { db, s } from './config'
import _ from 'lodash'

type CursorBuilder<Selectable> = (rows: Partial<Selectable>[]) => {
  cursor?: Cursor
}

interface OrderForTable<T extends s.Table> {
  by: s.SQLForTable<T>
  direction: 'ASC' | 'DESC'
  nulls?: 'FIRST' | 'LAST'
}

// TODO: pass order spec directly instead of field,idField, etc
// https://leopard.in.ua/2014/10/11/postgresql-paginattion#.XpNGkJ9fgUE
export function makePaginator<T extends s.Table, Selectable>({
  cursor,
  field,
  idField,
  limit,
  dir = 'DESC'
}: {
  field: s.ColumnForTable<T>
  idField: s.ColumnForTable<T>
  dir?: 'DESC' | 'ASC'
  cursor?: Cursor
  limit: number
}): {
  where: s.WhereableForTable<T>
  opts: {
    order: OrderForTable<T>[]
    limit: number
  }
  makeCursor: CursorBuilder<Selectable>
} {
  const where = cursor
    ? {
        [field]: db.sql`(${db.self}, ${idField}) < (${db.param(
          cursor[0]
        )}, ${db.param(cursor[1])})`
        //[field]: (dir === 'DESC' ? dc.lte : dc.gte)(cursor[0]),
        //[idField]: dc.gt(cursor[1])
      }
    : {}
  // FIX: remove as, use OrderSpec from zapatos
  const order = [
    { by: field, direction: dir, nulls: 'LAST' },
    { by: idField, direction: dir }
  ] as OrderForTable<T>[]
  const makeCursor: CursorBuilder<Selectable> = (rows) => {
    const last = _.last(rows)
    if (rows.length < limit || !last) return {} // we get less than requested rows last time
    console.log('--- makeCursor last', last, { field, idField, limit })
    return { cursor: [last[field as string], last[idField as string]] }
  }
  return { where, opts: { order, limit }, makeCursor }
}
