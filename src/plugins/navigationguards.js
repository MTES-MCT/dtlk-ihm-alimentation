export default ({ router, store }) => {
  router.beforeEach((to, from, next) => {
    store.commit('auth/updateCounterRefresh')
    if (!to.name) {
      next()
    } else if (to.name === 'logout') {
      store.dispatch('auth/logout')
      router.push({name: 'login'})
    } else if (to.name === 'login') {
      if (store.getters['auth/sessionStatus'] === 'sessionActive') {
        router.push({ name: 'mypanel' })
      } else {
        next()
      }
    } else if (to.path.substring(0, 7) !== '/public') {
      if (store.getters['auth/sessionStatus'] === 'sessionActive') {
        store.commit('auth/updateExpirationDate')
        next()
      } else {
        store.commit('auth/updateRedirect', to.name)
        next(false)
      }
    } else {
      next()
    }
  })
}
