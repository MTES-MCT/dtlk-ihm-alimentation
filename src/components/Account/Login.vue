<template>
  <q-modal v-model="hasSessionInactive" no-route-dismiss no-esc-dismiss no-backdrop-dismiss :content-css="{minWidth: '350px'}">
    <q-modal-layout>
      <q-toolbar slot="header" class="text-bold" color="secondary">
        <img src="statics/user.png">
        <q-toolbar-title class="text-weight-medium text-white">
          Authentification
        </q-toolbar-title>
      </q-toolbar>
      <div class="q-pa-md">
        <div v-if="sessionExpired" class="q-my-md text-bold text-red">Votre session est expirée. merci de vous connecter à nouveau</div>
        <form @submit.prevent="submit">
          <q-field icon="mdi-at" class="q-mb-md">
            <q-input color="secondary" name="email" v-model="email" autocomplete="on" float-label="Votre adresse électronique" />
          </q-field>
          <q-field icon="mdi-lastpass" class="q-mb-md">
            <q-input type="password" name="password" color="secondary" v-model="password" autocomplete="off" float-label="Votre mot de passe" />
          </q-field>
          <div class="text-center">
            <q-btn outline icon="mdi-account-key" color="secondary" size="md" type="submit" label="Se connecter" title="Me connecter à l'application" />
          </div>
        </form>
      </div>
    </q-modal-layout>
  </q-modal>
</template>

<script>
export default {
  name: 'account-login',
  data () {
    return {
      email: null,
      password: null
    }
  },
  computed: {
    hasSessionInactive: {
      get () {
        return this.$store.getters['auth/sessionStatus'] !== 'sessionActive'
      }
    },
    sessionExpired () {
      return this.$store.getters['auth/sessionStatus'] === 'sessionExpired'
    }
  },
  methods: {
    async submit () {
      let credentials = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('auth/login', credentials)
        .then(() => {
          if (this.$store.state.auth.redirect) {
            this.$router.push({ name: this.$store.state.auth.redirect })
            this.$store.commit('auth/updateRedirect', null)
          } else {
            if (this.$router.currentRoute.name === 'login') this.$router.push({ name: 'mypanel' })
          }
        })
        .catch(() => this.$q.notify({type: 'negative', message: 'Impossible de vous authentifier avec les valeurs fournies. Veuillez vérifier votre saisie.', position: 'top', actions: [{ icon: 'mdi-close' }]}))
    }
  }
}
</script>

<style scoped lang="stylus">
.q-toolbar > img
  max-width 50px
  display inline
.q-collapsible /deep/ .q-item-label
  font-size 0.8em
</style>
