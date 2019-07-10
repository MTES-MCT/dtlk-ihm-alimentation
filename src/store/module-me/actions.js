import api from '../../api'

export const initializeInfos = async ({ commit, dispatch, rootGetters }) => {
  let myInfos = await api.myinfos(rootGetters['auth/apiKey'])
  commit('updateMyInfos', { myInfos: myInfos })
  // commit('mydatasets/updateRefreshed', false, { root: true })
  dispatch('mydatasets/initialize', {}, { root: true })
  // commit('messages/updateRefreshed', false, { root: true })
  dispatch('messages/initialize', {}, { root: true })
}
