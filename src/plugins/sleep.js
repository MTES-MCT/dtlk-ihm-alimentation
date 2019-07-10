let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export default ({ Vue }) => {
  Vue.prototype.$sleep = sleep
}

export { sleep }
