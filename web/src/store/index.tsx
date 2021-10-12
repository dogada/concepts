import { User, Theme } from '~/types'
import { createStoreon } from 'storeon'
// @ts-ignore
import { persistState } from '@storeon/localstorage'
import { StoreContext, useStoreon } from 'storeon/react'

// debug
import { storeonDevtools } from 'storeon/devtools'
import { storeonLogger } from 'storeon/devtools'

import { me } from './me'
import { Message } from '~/ui/AlertManager'
import { alerts } from './alerts'

export type State = {
  me: User | null
  theme: Theme
  alerts: Message[]
}

export type Events = {
  'me/set': User | null
  'me/login': undefined
  'me/logout': undefined
  'me/init': undefined
  'alerts/add': Message
  'alerts/remove': Message
}

export const store = createStoreon<State, Events>([
  me,
  alerts,
  typeof window !== 'undefined' && persistState(['theme']),
  process.env.NODE_ENV !== 'production' && storeonDevtools,
  process.env.NODE_ENV !== 'production' && storeonLogger
])

if (typeof window !== 'undefined') {
  // @ts-ignore
  window._wikiket_store = store
}
type Event = keyof Events

export function dispatchPromise(
  promise: Promise<any>,
  success: Event
): Promise<any> {
  return promise
    .then((res) => store.dispatch(success, res))
    .catch((e) => {
      console.error(e)
      dispatchError(e)
    })
}

export function dispatchAlert(
  variant: 'info' | 'warning' | 'danger',
  content: string
): void {
  store.dispatch('alerts/add', {
    id: Date.now(),
    variant,
    content
  })
}

export function dispatchError(e: Error): void {
  console.error('store.dispatchError', e)
  dispatchAlert('danger', `${e.message}` || 'Unknown error')
}

export const StoreonProvider: React.FC = ({ children }) => (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
)

export const useMe = () => useStoreon<State, Events>('me')
export const useAlerts = () => useStoreon<State, Events>('alerts')
