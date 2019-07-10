import Vue from 'vue'
import Vuex from 'vuex'

import auth from './module-auth'
import me from './module-me'
import mydatasets from './module-mydatasets'
import messages from './module-messages'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    me,
    mydatasets,
    messages
  }
})

export default store
