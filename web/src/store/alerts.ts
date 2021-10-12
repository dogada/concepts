import { StoreonModule } from 'storeon'
import { State, Events } from '.'

export const alerts: StoreonModule<State, Events> = (store) => {
  store.on('@init', () => ({ alerts: [] }))

  store.on('alerts/add', ({ alerts }, alert) => {
    return { alerts: [...alerts, alert] }
  })

  store.on('alerts/remove', ({ alerts }, alert) => {
    return { alerts: alerts.filter((a) => a !== alert) }
  })
}
