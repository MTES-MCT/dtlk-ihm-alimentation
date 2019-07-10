// initialize dataset
let initializeDataset = dataset => {
  dataset.pending_delete = false
  dataset.pending_update = false
  dataset.notify_update = false
  dataset.jobinprogress = null
  dataset.jobserror = []
  dataset.jobscomplete = []
  dataset.attachments = dataset.attachments.map(initializeAttachment)
  dataset.datafiles = dataset.datafiles.map(initializeDatafile)
  return dataset
}
// initialize attachment
let initializeAttachment = attachment => ({ ...attachment, pending_delete: false, pending_update: false, notify_update: false })
// initialize datafile
let initializeDatafile = datafile => ({ ...datafile, pending_delete: false, pending_delete_millesime: false, pending_update: false, notify_update: false, jobinprogress: null, jobserror: [], jobscomplete: [] })

// commit for updating state of modal
export const updateOpenModal = (state, { open, modal, usedDataset, usedDatafile, usedAttachment, usedObjectLog, usedJob }) => {
  if (['openModalDetailAttachment', 'openModalAddAttachment', 'openModalEditAttachment', 'openModalReplaceAttachment'].includes(modal)) {
    state[modal] = open
    if (!open) state.usedAttachment = null
    if (open && usedAttachment) state.usedAttachment = usedAttachment
  }
  if (['openModalDetailDatafile', 'openModalAddDatafile', 'openModalEditDatafile', 'openModalAddMillesimeDatafile', 'openModalReplaceMillesimeDatafile'].includes(modal)) {
    state[modal] = open
    if (!open) state.usedDatafile = null
    if (open && usedDatafile) state.usedDatafile = usedDatafile
  }
  if (['openModalWritingDataset'].includes(modal)) {
    state[modal] = open
    if (!open) state.usedDataset = null
    if (open && usedDataset) state.usedDataset = usedDataset
  }
  if (['openModalShowLogs'].includes(modal)) {
    state[modal] = open
    if (!open) state.usedObjectLog = null
    if (open && usedObjectLog) state.usedObjectLog = usedObjectLog
  }
  if (['openModalDetailJob'].includes(modal)) {
    state.jobs.openModalDetailJob = open
    if (!open) state.jobs.usedJob = null
    if (open && usedJob) state.jobs.usedJob = usedJob
  }
}

// commit for setPendingStateAction
export const setPendingStateAction = (state, { action, dataset, attachment, datafile }) => {
  if (action === 'loadDatasetsList') state.pending_list = true
  if (action === 'addDataset') state.pending_add = true
  if (action === 'updateDataset') state.usedDataset.pending_update = true
  if (action === 'deleteDataset') dataset.pending_delete = true
  if (action === 'addAttachment') state.usedAttachment.dataset.pending_update = true
  if (action === 'updateAttachment') state.usedAttachment.attachment.pending_update = true
  if (action === 'deleteAttachment') attachment.pending_delete = true
  if (action === 'addDatafile') state.usedDatafile.dataset.pending_update = true
  if (action === 'updateDatafile') state.usedDatafile.datafile.pending_update = true
  if (action === 'addDatafileMillesime') state.usedDatafile.datafile.pending_update = true
  if (action === 'replaceDatafileMillesime') state.usedDatafile.datafile.pending_update = true
  if (action === 'deleteLastMillesimeDatafile') datafile.pending_delete_millesime = true
  if (action === 'deleteDatafile') datafile.pending_delete = true
  if (action === 'loadJobsList') state.jobs.pending_list = true
}
// commit for unsetPendingStateAction
export const unsetPendingStateAction = (state, { action, dataset, attachment, datafile }) => {
  if (action === 'loadDatasetsList') state.pending_list = false
  if (action === 'addDataset') state.pending_add = false
  if (action === 'updateDataset') state.usedDataset.pending_update = false
  if (action === 'deleteDataset') dataset.pending_delete = false
  if (action === 'addAttachment') state.usedAttachment.dataset.pending_update = false
  if (action === 'updateAttachment') state.usedAttachment.attachment.pending_update = false
  if (action === 'deleteAttachment') attachment.pending_delete = false
  if (action === 'addDatafile') state.usedDatafile.dataset.pending_update = false
  if (action === 'updateDatafile') state.usedDatafile.datafile.pending_update = false
  if (action === 'addDatafileMillesime') state.usedDatafile.datafile.pending_update = false
  if (action === 'replaceDatafileMillesime') state.usedDatafile.datafile.pending_update = false
  if (action === 'deleteLastMillesimeDatafile') datafile.pending_delete_millesime = false
  if (action === 'deleteDatafile') datafile.pending_delete = false
  if (action === 'loadJobsList') state.jobs.pending_list = false
}

// commit for updating list of datasets
export const updateLists = (state, { datasets, jobs }) => {
  state.list = datasets.map(initializeDataset)
  state.jobs.list = jobs
  for (let job of jobs) {
    if (['created', 'delayed', 'active', 'inactive'].includes(job.data.status)) {
      if (job.data.task === 'createDatafile') {
        state.list.find(dataset => dataset.id === job.data.dataset_id).jobinprogress = job
      }
      if (['replaceDatafileMillesime', 'addDatafileMillesime'].includes(job.data.task)) {
        state.list.find(dataset => dataset.id === job.data.dataset_id).datafiles.find(datafile => datafile.rid === job.data.datafile_rid).jobinprogress = job
      }
    }
  }
  state.refreshed = true
}

// commit for creating dataset
export const addDataset = (state, { newDataset }) => {
  state.list.unshift(initializeDataset(newDataset))
}

// commit for updating dataset
export const updateDataset = (state, { updatedDataset }) => {
  let idxDataset = state.list.indexOf(state.usedDataset)
  let jobserror = state.usedDataset.jobserror
  let jobinprogress = state.usedDataset.jobinprogress
  let datafiles = state.usedDataset.datafiles
  updatedDataset = initializeDataset(updatedDataset)
  updatedDataset.jobserror = jobserror
  updatedDataset.jobinprogress = jobinprogress
  updatedDataset.datafiles = datafiles
  state.list.splice(idxDataset, 1, updatedDataset)
  state.list[idxDataset].notify_update = true
  setTimeout(() => (state.list[idxDataset].notify_update = false), 2000)
}

// commit for removing dataset
export const deleteDataset = (state, { dataset }) => {
  let idxDataset = state.list.indexOf(dataset)
  state.list.splice(idxDataset, 1)
}

// commit for creating attachment
export const addAttachment = (state, { newAttachment }) => {
  state.usedAttachment.dataset.attachments.unshift(initializeAttachment(newAttachment))
}

// commit for updating attachment (replace file or edit metadata)
export const updateAttachment = (state, { updatedAttachment }) => {
  let idxDataset = state.list.indexOf(state.usedAttachment.dataset)
  let idxAttachment = state.list[idxDataset].attachments.indexOf(state.usedAttachment.attachment)
  state.list[idxDataset].attachments.splice(idxAttachment, 1, initializeAttachment(updatedAttachment))
  state.list[idxDataset].attachments[idxAttachment].notify_update = true
  setTimeout(() => (state.list[idxDataset].attachments[idxAttachment].notify_update = false), 2000)
}

// commit for removing attachment
export const deleteAttachment = (state, { dataset, attachment }) => {
  let idxAttachment = dataset.attachments.indexOf(attachment)
  dataset.attachments.splice(idxAttachment, 1)
}

// commit for putting job in dataset
export const addJobDataset = (state, { job }) => {
  state.jobs.list.push(job)
  state.usedDatafile.dataset.jobinprogress = job
}

// commit for updating datafile metadata
export const updateDatafile = (state, { updatedDatafile }) => {
  let idxDataset = state.list.indexOf(state.usedDatafile.dataset)
  let idxDatafile = state.list[idxDataset].datafiles.indexOf(state.usedDatafile.datafile)
  let joberrors = state.usedDatafile.datafile.jobserror
  updatedDatafile = initializeDatafile(updatedDatafile)
  updatedDatafile.jobserror = joberrors
  state.list[idxDataset].datafiles.splice(idxDatafile, 1, updatedDatafile)
  state.list[idxDataset].datafiles[idxDatafile].notify_update = true
  setTimeout(() => (state.list[idxDataset].datafiles[idxDatafile].notify_update = false), 2000)
}

// commit for putting job in datafile
export const addJobDatafile = (state, { job }) => {
  state.jobs.list.push(job)
  state.usedDatafile.datafile.jobinprogress = job
}

// commit for removing last datafile millesime
export const deleteLastMillesimeDatafile = (state, { dataset, datafile }) => {
  let idxDatafile = dataset.datafiles.indexOf(datafile)
  let millesimeInfo = dataset.datafiles[idxDatafile].millesimes_info.find(millesime => millesime === datafile.millesimes)
  let idxMillesime = dataset.datafiles[idxDatafile].millesimes_info.indexOf(millesimeInfo)
  dataset.datafiles[idxDatafile].millesimes = dataset.datafiles[idxDatafile].millesimes - 1
  dataset.datafiles[idxDatafile].millesimes_info.splice(idxMillesime, 1)
  dataset.datafiles[idxDatafile].notify_update = true
  setTimeout(() => (dataset.datafiles[idxDatafile].notify_update = false), 2000)
}

// commit for removing datafile
export const deleteDatafile = (state, { dataset, datafile }) => {
  let idxDatafile = dataset.datafiles.indexOf(datafile)
  dataset.datafiles.splice(idxDatafile, 1)
}

// commit for updating job in job list
export const updateJob = (state, { updatedJob }) => {
  let idxJob = state.jobs.list.indexOf(state.jobs.list.find(job => job.id === updatedJob.id))
  state.jobs.list.splice(idxJob, 1, updatedJob)
  if (state.jobs.usedJob && (state.jobs.usedJob.id === updatedJob.id)) state.jobs.usedJob = updatedJob
}

// commit for updating activejob in dataset or datafile
export const updateActiveJob = (state, { job }) => {
  let datasetOfJob = state.list.find(dataset => dataset.id === job.data.dataset_id)
  if (['addDatafileMillesime', 'replaceDatafileMillesime'].includes(job.data.task)) {
    let datafileOfJob = datasetOfJob.datafiles.find(datafile => datafile.rid === job.data.datafile_rid)
    datafileOfJob.jobinprogress = job
  }
  if (job.data.task === 'createDatafile') datasetOfJob.jobinprogress = job
}

// commit for updating failed job in dataset or datafile
export const processFailedJob = (state, { job }) => {
  let datasetOfJob = state.list.find(dataset => dataset.id === job.data.dataset_id)
  if (['addDatafileMillesime', 'replaceDatafileMillesime'].includes(job.data.task)) {
    let datafileOfJob = datasetOfJob.datafiles.find(datafile => datafile.rid === job.data.datafile_rid)
    datafileOfJob.jobinprogress = null
    datafileOfJob.notify_update = true
    datafileOfJob.jobserror.unshift(job)
    setTimeout(() => (datafileOfJob.notify_update = false), 2000)
  }
  if (job.data.task === 'createDatafile') {
    datasetOfJob.jobinprogress = null
    datasetOfJob.notify_update = true
    datasetOfJob.jobserror.unshift(job)
    setTimeout(() => (datasetOfJob.notify_update = false), 2000)
  }
}

// commit for updating complete job in dataset or datafile
export const processCompleteJob = (state, { job, datafile }) => {
  let datasetOfJob = state.list.find(dataset => dataset.id === job.data.dataset_id)
  if (['addDatafileMillesime', 'replaceDatafileMillesime'].includes(job.data.task)) {
    let datafileOfJob = datasetOfJob.datafiles.find(datafile => datafile.rid === job.data.datafile_rid)
    let idxDatafileOfJob = datasetOfJob.datafiles.indexOf(datafileOfJob)
    let joberrors = datafileOfJob.jobserror
    datafile = initializeDatafile(datafile)
    datafile.jobserror = joberrors
    datasetOfJob.datafiles.splice(idxDatafileOfJob, 1, datafile)
    datasetOfJob.datafiles[idxDatafileOfJob].notify_update = true
    setTimeout(() => (datasetOfJob.datafiles[idxDatafileOfJob].notify_update = false), 2000)
  }
  if (job.data.task === 'createDatafile') {
    datasetOfJob.jobinprogress = null
    datasetOfJob.notify_update = true
    datasetOfJob.datafiles.unshift(initializeDatafile(datafile))
    setTimeout(() => (datasetOfJob.notify_update = false), 2000)
  }
}

// commit for removing job
export const removeJobs = (state, { type, datasetId, datafileRid, datafileMillesime }) => {
  if (type === 'datafileMillesime') {
    state.jobs.list = state.jobs.list.filter(job => {
      if ((job.data.datafile_rid === datafileRid) && (job.data.datafile_millesime === datafileMillesime)) return false
      if (job.result && (job.result.rid === datafileRid) && (job.result.millesime === datafileMillesime)) return false
      return true
    })
  }
  if (type === 'datafile') {
    state.jobs.list = state.jobs.list.filter(job => {
      if (job.data.datafile_rid === datafileRid) return false
      if (job.result && (job.result.rid === datafileRid)) return false
      return true
    })
  }
  if (type === 'dataset') {
    state.jobs.list = state.jobs.list.filter(job => {
      if (job.data.dataset_id === datasetId) return false
      return true
    })
  }
}

// commit for removing job error adding datafile
export const removeErrorAddDatafile = (state, { dataset, job }) => {
  let i = dataset.jobserror.indexOf(job)
  dataset.jobserror.splice(i, 1)
}

// commit for removing job error editing datafile
export const removeErrorEditDatafile = (state, { datafile, job }) => {
  let i = datafile.jobserror.indexOf(job)
  datafile.jobserror.splice(i, 1)
}
