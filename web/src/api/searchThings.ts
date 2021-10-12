import { Context, PaginatedItems, Thing } from '~/types'

export async function searchThings(
  data: { q: string },
  ctx: Context
): Promise<PaginatedItems<Thing>> {
  return { items: [] }
}
