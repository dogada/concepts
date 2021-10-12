export type Unpromisify<T> = T extends Promise<infer R> ? R : T
export type FirstArg<T> = T extends (arg: infer R, ...args: any[]) => any
  ? R
  : never

export type ActionData = any

export type ActionMeta = {
  method?: 'GET' | 'POST'
  id: string
  cache?: {
    id: string
    maxAge?: number
  }
  allowedGroups?: string[]
}

export type ApiMeta<Api> = {
  [P in keyof Api]: Omit<ActionMeta, 'id'>
}

type ActionOpts = {
  user?: object
}

// TODO: use (data?, opts?, next?) signature like Express?
// FIX: ActionProducer<Api> produce functions with signatures from Api instead of abstract Action
export type Action = (data?: ActionData, opts?: ActionOpts) => Promise<any>

export type ActionProducer = (meta: ActionMeta, next?: Action) => Action

// build type for an action declared in Api but without opts available on server (user, version, etc)
// TODO: in TS 3.0 take into account optional data parameter, for example getMe()
export type ClientAction<A> = A extends (
  data: infer D,
  ...rest: any[]
) => infer R
  ? (data: D) => R
  : never

export type ClientApi<Api> = {
  [P in keyof Api]: ClientAction<Api[P]>
}

export type Client = Record<string, Action>
