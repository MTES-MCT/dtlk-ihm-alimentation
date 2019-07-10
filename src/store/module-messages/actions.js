import api from '../../api'
import { Notify } from 'quasar'

export const initialize = async ({ commit, state, dispatch, rootGetters }) => {
  if (state.refreshed === false) {
    commit('loadingList')
    let messages = await api.mymessages(rootGetters['auth/apiKey'])
    commit('updateList', { messages: messages })
    commit('updateRefreshed', true)
  }
}

export const markAs = async ({ commit, rootGetters }, { message, read }) => {
  await api.markmessage(rootGetters['auth/apiKey'], message.id, read)
    .then(updatedMessage => commit('updateMessageInList', { updatedMessage: updatedMessage }))
    .catch(error => Notify.create({ type: 'negative', message: error.message, position: 'top', actions: [{ icon: 'mdi-close-outline', handler: () => {} }] }))
    .finally(() => commit('unsetPendingDelete', message))
}

export const deleteMessage = async ({ commit, state, rootGetters }, { message }) => {
  commit('setPendingDelete', message)
  await api.deletemessage(rootGetters['auth/apiKey'], message.id)
    .then(() => new Promise((resolve, reject) => setTimeout(() => resolve(), 2000)))
    .then(() => commit('deleteMessageInList', { deletedMessage: message }))
    .then(() => Notify.create({ type: 'positive', message: 'Le message a bien été supprimé', position: 'top', actions: [{ icon: 'mdi-close-outline', handler: () => {} }] }))
    .catch(error => Notify.create({ type: 'negative', message: error.message, position: 'top', actions: [{ icon: 'mdi-close-outline', handler: () => {} }] }))
    .finally(() => commit('unsetPendingDelete', message))
}
