import api from '../../api'
import { Notify } from 'quasar'

let myNotify = {
  success: message => {
    Notify.create({ type: 'positive', message: message, position: 'top', actions: [{ icon: 'mdi-close-outline', handler: () => {} }] })
    return true
  },
  error: error => {
    Notify.create({ type: 'negative', message: error.message, position: 'top', actions: [{ icon: 'mdi-close-outline', handler: () => {} }] })
    return false
  }
}

export const initialize = async ({ commit, dispatch, state, rootGetters }) => {
  if (state.refreshed === false) {
    commit('setPendingStateAction', { action: 'loadDatasetsList' })
    commit('setPendingStateAction', { action: 'loadJobsList' })
    await Promise.all([api.getorgdatasets(rootGetters['auth/apiKey']), api.myjobs(rootGetters['auth/apiKey'])])
      .then(([datasets, jobs]) => {
        commit('updateLists', { datasets: datasets, jobs: jobs })
        for (let job of jobs) {
          if (['created', 'delayed', 'active', 'inactive'].includes(job.state.status)) {
            setTimeout(() => dispatch('refreshJob', { job: job }), 2000)
          }
        }
      })
      .then(() => { state.refreshed = true })
      .catch(error => myNotify.error(error))
      .finally(() => {
        commit('unsetPendingStateAction', { action: 'loadDatasetsList' })
        commit('unsetPendingStateAction', { action: 'loadJobsList' })
      })
  }
}

export const addDataset = async ({ commit, rootGetters }, payload) => {
  commit('setPendingStateAction', { action: 'addDataset' })
  let result = await api.createdataset(rootGetters['auth/apiKey'], payload)
    .then(newDataset => commit('addDataset', { newDataset: newDataset }))
    .then(() => myNotify.success('Votre jeu de données a bien été ajouté.'))
    .catch(error => myNotify.error(error))
    .finally(() => commit('unsetPendingStateAction', { action: 'addDataset' }))
  return result
}

export const updateDataset = async ({ commit, state, rootGetters }, payload) => {
  commit('setPendingStateAction', { action: 'updateDataset' })
  let result = await api.updateDataset(rootGetters['auth/apiKey'], payload, state.usedDataset.id)
    .then(updatedDataset => commit('updateDataset', { updatedDataset: updatedDataset }))
    .then(() => myNotify.success('Votre jeu de données a bien été mis-à-jour.'))
    .catch(error => myNotify.error(error))
    .finally(() => commit('unsetPendingStateAction', { action: 'updateDataset' }))
  return result
}

export const removeDataset = async ({ commit, rootGetters }, payload) => {
  commit('setPendingStateAction', { action: 'deleteDataset', dataset: payload })
  let result = await api.deletedataset(rootGetters['auth/apiKey'], payload.id)
    .then(() => commit('deleteDataset', { dataset: payload }))
    .then(() => commit('removeJobs', { type: 'dataset', datasetId: payload.id }))
    .then(() => myNotify.success('Votre jeu de données a bien été supprimé.'))
    .catch(error => myNotify.error(error))
    .finally(() => commit('unsetPendingStateAction', { action: 'deleteDataset', dataset: payload }))
  return result
}

export const addAttachment = async ({ commit, state, rootGetters }, payload) => {
  commit('setPendingStateAction', { action: 'addAttachment' })
  let result = await api.createattachment(rootGetters['auth/apiKey'], payload, state.usedAttachment.dataset.id)
    .then(newAttachment => commit('addAttachment', { newAttachment: newAttachment }))
    .then(() => myNotify.success('Votre fichier descriptif a bien été ajouté.'))
    .catch(error => myNotify.error(error))
    .finally(() => commit('unsetPendingStateAction', { action: 'addAttachment' }))
  return result
}

export const updateAttachment = async ({ commit, state, rootGetters }, payload) => {
  commit('setPendingStateAction', { action: 'updateAttachment' })
  let result = await api.updateAttachment(rootGetters['auth/apiKey'], payload, state.usedAttachment.dataset.id, state.usedAttachment.attachment.rid)
    .then(updatedAttachment => commit('updateAttachment', { updatedAttachment: updatedAttachment }))
    .then(() => myNotify.success('Votre fichier descriptif a bien été mis-à-jour.'))
    .catch(error => myNotify.error(error))
    .finally(() => commit('unsetPendingStateAction', { action: 'updateAttachment' }))
  return result
}

export const replaceAttachment = async ({ commit, state, rootGetters }, payload) => {
  commit('setPendingStateAction', { action: 'updateAttachment' })
  let result = await api.replaceAttachment(rootGetters['auth/apiKey'], payload, state.usedAttachment.dataset.id, state.usedAttachment.attachment.rid)
    .then(updatedAttachment => commit('updateAttachment', { updatedAttachment: updatedAttachment }))
    .then(() => myNotify.success('Votre fichier descriptif a bien été remplacé.'))
    .catch(error => myNotify.error(error))
    .finally(() => commit('unsetPendingStateAction', { action: 'updateAttachment' }))
  return result
}

export const removeAttachment = async ({ commit, rootGetters }, payload) => {
  commit('setPendingStateAction', { action: 'deleteAttachment', attachment: payload.attachment })
  let result = await api.deleteattachment(rootGetters['auth/apiKey'], payload.dataset.id, payload.attachment.rid)
    .then(() => commit('deleteAttachment', { dataset: payload.dataset, attachment: payload.attachment }))
    .then(() => myNotify.success('Votre fichier descriptif a bien été supprimé.'))
    .catch(error => myNotify.error(error))
    .finally(() => commit('unsetPendingStateAction', { action: 'deleteAttachment', attachment: payload.attachment }))
  return result
}

export const addDatafile = async ({ commit, state, dispatch, rootGetters }, payload) => {
  commit('setPendingStateAction', { action: 'addDatafile' })
  let result = await api.createdatafile(rootGetters['auth/apiKey'], payload, state.usedDatafile.dataset.id)
    .then(job => {
      commit('addJobDataset', { job: job })
      setTimeout(() => dispatch('refreshJob', { job: job }), 2000)
    })
    .then(() => myNotify.success(`Votre fichier a été accepté. La tâche d'intégration va être exécutée. Vous recevrez un mail lorsqu'elle sera terminée.`))
    .catch(error => myNotify.error(error))
    .finally(() => commit('unsetPendingStateAction', { action: 'addDatafile' }))
  return result
}

export const refreshJob = async ({ commit, dispatch, state, rootGetters }, payload) => {
  api.getjob(rootGetters['auth/apiKey'], payload.job.id)
    .then(job => {
      commit('updateJob', { updatedJob: job })
      if (['created', 'delayed', 'active', 'inactive'].includes(job.state.status)) {
        commit('updateActiveJob', { job: job })
        setTimeout(() => dispatch('refreshJob', { job: job }), 2000)
      }
      if (job.state.status === 'failed') {
        if (!job.error) setTimeout(() => dispatch('refreshJob', { job: job }), 2000)
        if (job.error) commit('processFailedJob', { job: job })
      }
      if (job.state.status === 'complete') {
        if (!job.result) setTimeout(() => dispatch('refreshJob', { job: job }), 2000)
        if (job.result) {
          let rid = job.data.datafile_rid || job.result.rid
          api.getdatafile(rootGetters['auth/apiKey'], job.data.dataset_id, rid)
            .then(datafile => commit('processCompleteJob', { job: job, datafile: datafile }))
        }
      }
    })
    .catch(error => console.log(error))
}

export const updateDatafile = async ({ commit, state, rootGetters }, payload) => {
  commit('setPendingStateAction', { action: 'updateDatafile' })
  let result = await api.updateDatafile(rootGetters['auth/apiKey'], payload, state.usedDatafile.dataset.id, state.usedDatafile.datafile.rid)
    .then(updatedDatafile => commit('updateDatafile', { updatedDatafile: updatedDatafile }))
    .then(() => myNotify.success('Votre fichier de données a bien été mis-à-jour.'))
    .catch(error => myNotify.error(error))
    .finally(() => commit('unsetPendingStateAction', { action: 'updateDatafile' }))
  return result
}

export const addDatafileMillesime = async ({ commit, dispatch, state, rootGetters }, payload) => {
  commit('setPendingStateAction', { action: 'addDatafileMillesime' })
  let result = await api.addDatafileMillesime(rootGetters['auth/apiKey'], payload, state.usedDatafile.dataset.id, state.usedDatafile.datafile.rid)
    .then(job => {
      commit('addJobDatafile', { job: job })
      setTimeout(() => dispatch('refreshJob', { job: job }), 2000)
    })
    .then(() => myNotify.success(`Votre fichier a été accepté. La tâche d'intégration va être exécutée. Vous recevrez un mail lorsqu'elle sera terminée.`))
    .catch(error => myNotify.error(error))
    .finally(() => commit('unsetPendingStateAction', { action: 'addDatafileMillesime' }))
  return result
}

export const replaceDatafileMillesime = async ({ commit, dispatch, state, rootGetters }, payload) => {
  commit('setPendingStateAction', { action: 'replaceDatafileMillesime' })
  let result = await api.replaceDatafileMillesime(rootGetters['auth/apiKey'], payload, state.usedDatafile.dataset.id, state.usedDatafile.datafile.rid, state.usedDatafile.millesime)
    .then(job => {
      commit('addJobDatafile', { job: job })
      setTimeout(() => dispatch('refreshJob', { job: job }), 2000)
    })
    .then(() => myNotify.success(`Votre fichier a été accepté. La tâche d'intégration va être exécutée. Vous recevrez un mail lorsqu'elle sera terminée.`))
    .catch(error => myNotify.error(error))
    .finally(() => commit('unsetPendingStateAction', { action: 'replaceDatafileMillesime' }))
  return result
}

export const removeDatafileMillesime = async ({ commit, rootGetters }, payload) => {
  commit('setPendingStateAction', { action: 'deleteMillesimeDatafile', dataset: payload.dataset, datafile: payload.datafile })
  let result = await api.deletedatafilemillesime(rootGetters['auth/apiKey'], payload.dataset.id, payload.datafile.rid, payload.millesimeToRemove)
    .then(() => commit('deleteMillesimeDatafile', { dataset: payload.dataset, datafile: payload.datafile, datafileMillesime: payload.millesimeToRemove }))
    .then(() => commit('removeJobs', { type: 'datafileMillesime', datasetId: payload.dataset.id, datafileRid: payload.datafile.rid, datafileMillesime: payload.millesimeToRemove }))
    .then(() => myNotify.success('Le millesime ' + payload.millesimeToRemove + ' du fichier de données a bien été supprimée.'))
    .catch(error => myNotify.error(error))
    .finally(() => commit('unsetPendingStateAction', { action: 'deleteMillesimeDatafile', dataset: payload.dataset, datafile: payload.datafile, datafileMillesime: payload.millesimeToRemove }))
  return result
}

export const removeDatafile = async ({ commit, rootGetters }, payload) => {
  commit('setPendingStateAction', { action: 'deleteDatafile', datafile: payload.datafile })
  let result = await api.deletedatafile(rootGetters['auth/apiKey'], payload.dataset.id, payload.datafile.rid)
    .then(() => commit('deleteDatafile', { dataset: payload.dataset, datafile: payload.datafile }))
    .then(() => commit('removeJobs', { type: 'datafile', datasetId: payload.dataset.id, datafileRid: payload.datafile.rid }))
    .then(() => myNotify.success('Le fichier de données a bien été supprimé.'))
    .catch(error => myNotify.error(error))
    .finally(() => commit('unsetPendingStateAction', { action: 'deleteDatafile', dataset: payload.dataset, datafile: payload.datafile }))
  return result
}
