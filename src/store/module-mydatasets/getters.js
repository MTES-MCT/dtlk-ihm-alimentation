export const alerts = state => {
  return state.list.filter(dataset => {
    if (!dataset.frequency_date) return false
    return ((new Date(dataset.frequency_date)).getTime() - (new Date()).getTime()) < (7 * 24 * 3600 * 1000)
  })
}

export const job = state => state.jobs.list.find(job => job.id === state.jobs.usedJob)
