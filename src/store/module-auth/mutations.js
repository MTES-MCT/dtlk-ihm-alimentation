import { SessionStorage, date } from 'quasar'
const { addToDate } = date

export const logout = state => {
  SessionStorage.remove('DatalakeIntraUser')
  SessionStorage.remove('DatalakeIntraApiKey')
  SessionStorage.remove('DatalakeIntraSessionExpirationDate')
  SessionStorage.remove('ReferentielGranularities')
  SessionStorage.remove('ReferentielFrequencies')
  SessionStorage.remove('ReferentielLicenses')
  SessionStorage.remove('ReferentielTags')
  SessionStorage.remove('ReferentielTopics')
  SessionStorage.remove('zones')
  updateCounterRefresh(state)
  updateRedirect(state, null)
}
export const loginSuccess = (state, user) => {
  SessionStorage.set('DatalakeIntraUser', {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    active: user.active,
    since: user.since,
    organizations: user.organizations
  })
  SessionStorage.set('DatalakeIntraApiKey', user.apiKey)
  SessionStorage.set('DatalakeIntraSessionExpirationDate', addToDate(new Date(), { minutes: 30 }))
  updateCounterRefresh(state)
}
export const updateExpirationDate = state => {
  SessionStorage.set('DatalakeIntraSessionExpirationDate', addToDate(new Date(), { minutes: 30 }))
  updateCounterRefresh(state)
}
export const updateCounterRefresh = (state) => {
  state.counterRefresh++
}
export const updateRedirect = (state, routeName) => {
  state.redirect = routeName
}
