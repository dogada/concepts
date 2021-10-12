import { Initial } from './hooks/useApi'
import { FirstArg, Action } from './types'

export async function queryWithData<A extends Action>(
  endpoint: A,
  query: FirstArg<A>
): Promise<Initial<A>> {
  return endpoint(query).then((data) => ({ data, query }))
}
