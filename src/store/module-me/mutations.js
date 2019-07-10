// update my_infos
export const updateMyInfos = (state, { myInfos }) => {
  state.datasets = myInfos.datasets
  state.jobs = myInfos.jobs
  state.alerts = myInfos.alerts
  state.messages = myInfos.messages
}
