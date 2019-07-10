import { SessionStorage } from 'quasar'

export const sessionStatus = (state, getters) => {
  if (!getters.sessionExpirationDate) return 'noSession'
  if (getters.sessionExpirationDate.getTime() < (new Date()).getTime()) return 'sessionExpired'
  return 'sessionActive'
}

export const user = state => {
  if (state.counterRefresh) {
    return SessionStorage.get.item('DatalakeIntraUser')
  }
  return null
}

export const apiKey = state => {
  if (state.counterRefresh) {
    return SessionStorage.get.item('DatalakeIntraApiKey')
  }
  return null
}
export const sessionExpirationDate = state => {
  if (state.counterRefresh) {
    return SessionStorage.get.item('DatalakeIntraSessionExpirationDate')
  }
  return null
}
