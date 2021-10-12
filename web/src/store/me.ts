import { StoreonModule } from 'storeon'
import { HttpError } from '~/concepts/httperror'
import { api } from '~/config'
import { dispatchError, dispatchPromise } from '.'
import { Events, State } from '.'

const UnauthorizedStatus = 401

export const me: StoreonModule<State, Events> = (store) => {
  store.on('@init', () => ({ me: undefined }))
  store.on('me/set', (state, user) => {
    return { me: user }
  })

  store.on('me/init', async () => {
    try {
      const user = await api.getMe({})
      store.dispatch('me/set', user)
    } catch (e) {
      if ((e as HttpError).status !== UnauthorizedStatus) {
        return dispatchError(e as Error)
      }
    }
  })

  store.on('me/login', () => dispatchPromise(api.getMe({}), 'me/set'))
}
