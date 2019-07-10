let env = (key, fallback) => process.env[key] || fallback

export default ({ Vue }) => {
  Vue.prototype.$env = env
}

export { env }
