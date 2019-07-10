import { axios } from 'plugins/axios'
import { env } from 'plugins/env'
import { sleep } from 'plugins/sleep'
import { SessionStorage } from 'quasar'
import store from '../store'

let checkAuth = () => {
  store.commit('auth/updateCounterRefresh')
  return store.getters['auth/sessionStatus'] === 'sessionActive'
}

export default {
  getgranularities: async () => {
    try {
      let request = await axios.get(env('apiUrl') + 'referentiels/granularities')
      return request.data
    } catch (error) {
      console.log('pb during api.getgranularities', error)
      return []
    }
  },

  getfrequencies: async () => {
    try {
      let request = await axios.get(env('apiUrl') + 'referentiels/frequencies')
      return request.data
    } catch (error) {
      console.log('pb during api.getfrequencies', error)
      return []
    }
  },

  getlicenses: async () => {
    try {
      let request = await axios.get(env('apiUrl') + 'referentiels/licenses')
      return request.data
    } catch (error) {
      console.log('pb during api.getlicenses', error)
      return []
    }
  },

  gettopics: async () => {
    try {
      let request = await axios.get(env('apiUrl') + 'referentiels/topics')
      return request.data
    } catch (error) {
      console.log('pb during api.gettopics', error)
      return []
    }
  },

  gettags: async () => {
    try {
      let request = await axios.get(env('apiUrl') + 'referentiels/tags?results=all')
      return request.data
    } catch (error) {
      console.log('pb during api.gettags', error)
      return []
    }
  },

  getorganizations: async (apiKey) => {
    try {
      if (!checkAuth()) throw new Error('Vous devez être authentifié')
      let request = await axios.get(env('apiUrl') + 'referentiels/organizations')
      return request.data
    } catch (error) {
      console.log('pb during api.getorganizations', error)
      return []
    }
  },

  askaccount: async (form) => {
    try {
      // let request = await axios.get(env('apiUrl') + 'refs/organizations')
      // return request.data
      console.log(form)
      throw new Error()
    } catch (error) {
      console.log('pb during api.askaccount', error)
      throw new Error('Il y a eu un problème. Merci d\'essayer plus tard.')
    }
  },

  checkcredentials: async (credentials) => {
    try {
      let request = await axios.post(env('apiUrl') + 'auth', credentials)
      return request.data
    } catch (error) {
      console.log('pb during api.checkcredentials', error)
      throw new Error(error.message)
    }
  },

  getorgdatasets: async (apiKey) => {
    try {
      if (!checkAuth()) throw new Error('Vous devez être authentifié')
      let request = await axios.get(env('apiUrl') + 'datasets', { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.getorgdatasets', error)
      throw error.response.data
    }
  },

  getzone: async (id) => {
    let zonesInSession = SessionStorage.has('zones') ? SessionStorage.get.item('zones') : {}
    if (zonesInSession[id]) return zonesInSession[id]
    try {
      let request = await axios.get(env('apiUrl') + 'referentiels/zones/' + id)
      let zone = request.data
      zonesInSession[id] = zone
      SessionStorage.set('zones', zonesInSession)
      return zone
    } catch (error) {
      console.log('pb during api.getzone', error)
      return null
    }
  },

  getsuggestzones: async (search) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    try {
      let request = await axios.get(env('apiUrl') + 'referentiels/zones', {params: {search: search}})
      return request.data
    } catch (error) {
      console.log('pb during api.getsuggestzones', error)
      return null
    }
  },

  createdataset: async (apiKey, data) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    await sleep(2000)
    try {
      let request = await axios.post(env('apiUrl') + 'datasets', data, { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.createdataset', error.response)
      throw error.response.data
    }
  },

  updateDataset: async (apiKey, data, id) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    await sleep(2000)
    try {
      let request = await axios.put(env('apiUrl') + 'datasets/' + id, data, { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.updateDataset', error.response)
      throw error.response.data
    }
  },

  deletedataset: async (apiKey, id) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    await sleep(2000)
    try {
      await axios.delete(env('apiUrl') + 'datasets/' + id, { headers: { 'x-api-key': apiKey } })
      return true
    } catch (error) {
      console.log('pb during api.deletedataset', error.response)
      throw error.response.data
    }
  },

  createattachment: async (apiKey, data, id) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    await sleep(2000)
    try {
      let request = await axios.post(env('apiUrl') + 'datasets/' + id + '/attachments', data, { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.createattachment', error.response)
      throw error.response.data
    }
  },

  updateAttachment: async (apiKey, data, id, rid) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    await sleep(2000)
    try {
      let request = await axios.put(env('apiUrl') + 'datasets/' + id + '/attachments/' + rid + '/metadata', data, { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.updateAttachment', error.response)
      throw error.response.data
    }
  },

  replaceAttachment: async (apiKey, data, id, rid) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    await sleep(2000)
    try {
      let request = await axios.put(env('apiUrl') + 'datasets/' + id + '/attachments/' + rid + '/file', data, { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.replaceAttachment', error.response)
      throw error.response.data
    }
  },

  deleteattachment: async (apiKey, id, rid) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    await sleep(2000)
    try {
      await axios.delete(env('apiUrl') + 'datasets/' + id + '/attachments/' + rid, { headers: { 'x-api-key': apiKey } })
      return true
    } catch (error) {
      console.log('pb during api.deleteattachment', error.response)
      throw error.response.data
    }
  },

  createdatafile: async (apiKey, data, id) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    await sleep(2000)
    try {
      let request = await axios.post(env('apiUrl') + 'datasets/' + id + '/datafiles', data, { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.createdatafile', error.response)
      throw error.response.data
    }
  },

  updateDatafile: async (apiKey, data, id, rid) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    await sleep(2000)
    try {
      let request = await axios.put(env('apiUrl') + 'datasets/' + id + '/datafiles/' + rid + '/metadata', data, { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.updateDatafile', error.response)
      throw error.response.data
    }
  },

  addDatafileMillesime: async (apiKey, data, id, rid) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    await sleep(2000)
    try {
      let request = await axios.post(env('apiUrl') + 'datasets/' + id + '/datafiles/' + rid, data, { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.addDatafileMillesime', error.response)
      throw error.response.data
    }
  },

  replaceDatafileMillesime: async (apiKey, data, id, rid, millesime) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    await sleep(2000)
    try {
      let request = await axios.put(env('apiUrl') + 'datasets/' + id + '/datafiles/' + rid + '/millesimes/' + millesime, data, { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.replaceDatafileMillesime', error.response)
      throw error.response.data
    }
  },

  deletedatafilemillesime: async (apiKey, id, rid, millesime) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    await sleep(2000)
    try {
      await axios.delete(env('apiUrl') + 'datasets/' + id + '/datafiles/' + rid + '/millesimes/' + millesime, { headers: { 'x-api-key': apiKey } })
      return true
    } catch (error) {
      console.log('pb during api.deletedatafilemillesime', error.response)
      throw error.response.data
    }
  },

  deletedatafile: async (apiKey, id, rid) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    await sleep(2000)
    try {
      await axios.delete(env('apiUrl') + 'datasets/' + id + '/datafiles/' + rid, { headers: { 'x-api-key': apiKey } })
      return true
    } catch (error) {
      console.log('pb during api.deletedatafile', error.response)
      throw error.response.data
    }
  },

  getjob: async (apiKey, id) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    await sleep(2000)
    try {
      let request = await axios.get(env('apiUrl') + 'jobs/' + id, { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.getjob', error)
      return null
    }
  },

  getdatafile: async (apiKey, id, rid) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    await sleep(2000)
    try {
      let request = await axios.get(env('apiUrl') + 'datasets/' + id + '/datafiles/' + rid, { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.getdatafile', error)
      return null
    }
  },

  uploadFileOptions: {
    url: env('apiUrl') + 'files',
    headersPost (apiKey, fileName) {
      if (!checkAuth()) throw new Error('Vous devez être authentifié')
      let headers = { 'x-api-key': apiKey, 'Content-Type': 'application/octet-stream' }
      if (fileName) headers['x-uploadedfile-name'] = fileName
      return headers
    }
  },

  removeuploadedfile: (apiKey, token) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    axios
      .delete(env('apiUrl') + 'files/' + token, { headers: { 'x-api-key': apiKey } })
      .catch((error) => console.log(error))
  },

  checkcsvfile: async (apiKey, token) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    try {
      let request = await axios.get(env('apiUrl') + 'files/' + token + '/checkcsv', { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log(error)
      return null
    }
  },

  myinfos: async (apiKey) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    try {
      let request = await axios.get(env('apiUrl') + 'users/me/infos', { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.myinfos', error)
      return null
    }
  },

  myjobs: async (apiKey) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    try {
      let request = await axios.get(env('apiUrl') + 'jobs', { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.myjobs', error)
      throw error.response.data
    }
  },

  mymessages: async (apiKey) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    try {
      let request = await axios.get(env('apiUrl') + 'messages', { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.mymessages', error)
      return []
    }
  },

  markmessage: async (apiKey, id, read) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    try {
      let request = await axios.put(env('apiUrl') + 'messages/' + id, {read: read}, { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.markmessage', error)
      return []
    }
  },

  deletemessage: async (apiKey, id) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    try {
      await axios.delete(env('apiUrl') + 'messages/' + id, { headers: { 'x-api-key': apiKey } })
      return true
    } catch (error) {
      console.log('pb during api.mymessages', error)
      return []
    }
  },

  getdatasetlogs: async (apiKey, id, rid) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    await sleep(2000)
    try {
      let request = await axios.get(env('apiUrl') + 'datasets/' + id + '/logs', { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.getdatasetlogs', error)
      throw error.response.data
    }
  },

  getdatafilelogs: async (apiKey, id, rid) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    await sleep(2000)
    try {
      let request = await axios.get(env('apiUrl') + 'datasets/' + id + '/datafiles/' + rid + '/logs', { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.getdatafilelogs', error)
      return null
    }
  },

  getattachmentlogs: async (apiKey, id, rid) => {
    if (!checkAuth()) throw new Error('Vous devez être authentifié')
    await sleep(2000)
    try {
      let request = await axios.get(env('apiUrl') + 'datasets/' + id + '/attachments/' + rid + '/logs', { headers: { 'x-api-key': apiKey } })
      return request.data
    } catch (error) {
      console.log('pb during api.getattachmentlogs', error)
      return null
    }
  }
}
