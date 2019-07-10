import { Notify, Loading, QSpinnerGears } from 'quasar'
import api from '../../api'

export const logout = ({ commit }) => {
  commit('logout')
}

export const login = async ({ commit }, credentials) => {
  Loading.show({ spinner: QSpinnerGears, message: 'Envoi de vos informations en cours. Merci de patienter.', customClass: 'light-dimmed bg-indigo-1', messageColor: 'black', spinnerColor: 'black' })
  try {
    let user = await api.checkcredentials(credentials)
    commit('loginSuccess', user)
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Impossible de vous authentifier avec vos données saisies. Vérifiez votre saisie',
      position: 'top',
      actions: [{ icon: 'mdi-close-outline', handler: () => {} }]
    })
  } finally {
    Loading.hide()
  }
}
