import { ApiMeta, ActionMeta, ActionProducer, Action, ClientApi } from './types'

function buildChain(descriptor: ActionMeta, producers: ActionProducer[]) {
  const chain = [...producers].reverse()
  return chain.reduce<Action | undefined>(
    (previous, current) => current(descriptor, previous),
    undefined
  ) as Action
}

export function makeClient<API>(
  descriptors: ApiMeta<API>,
  producers: ActionProducer[]
): ClientApi<API> {
  const client = {}
  for (const id in descriptors) {
    if (!{}.hasOwnProperty.call(descriptors, id)) continue
    // @ts-ignore
    client[id] = buildChain({ id, ...descriptors[id] }, producers)
  }
  return client as ClientApi<API>
}
