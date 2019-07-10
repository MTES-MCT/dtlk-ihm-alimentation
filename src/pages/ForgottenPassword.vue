<template>
  <q-page class="forgottenPasswordPage row text-justify">
    <q-card class="forgottenPasswordCard absolute-center col-xs-12 col-sm-12 col-md-6" v-show="!isDisabled && !finishedWithoutErrors">
      <q-card-media class="avatar text-center bg-secondary">
        <img src="statics/user.png">
        <q-card-title slot="overlay">J'ai oublié mon mot de passe</q-card-title>
      </q-card-media>
      <q-card-separator />
      <div>
        <q-card-main>
          <q-field icon="mdi-at">
            <q-input color="secondary" v-model="email" float-label="Votre adresse électronique" />
          </q-field>
        </q-card-main>
        <q-card-actions align="center" class="forgottenPasswordActions">
          <q-btn outline color="secondary" @click="submit" size="md" label="Valider" title="Valider l'envoi de votre adresse électronique" />
        </q-card-actions>
        <q-card-separator />
        <q-card-actions align="between">
          <q-btn flat color="secondary" @click="$router.push({name: 'login'})" size="sm" label="Annuler" title="Retour à la page d'authentification" />
        </q-card-actions>
      </div>
    </q-card>
    <q-inner-loading :visible="isDisabled">
      <q-spinner-gears :size="50" color="secondary" />
      <br><br>
      <div class="text-secondary full-width text-center">Nous envoyons vos informations. Merci de patienter...</div>
    </q-inner-loading>
    <q-card class="forgottenPasswordCard absolute-center col-xs-12 col-sm-12 col-md-6" v-show="finishedWithoutErrors">
      <q-card-media class="avatar text-center bg-secondary">
        <img src="statics/user.png">
        <q-card-title slot="overlay">J'ai oublié mon mot de passe</q-card-title>
      </q-card-media>
      <q-card-separator />
      <div>
        <q-card-main>
          Vos informations ont bien été envoyées.<br><br> Vous allez recevoir un courrier électronique vous permettant de réinitialiser votre mot de passe.
        </q-card-main>
        <q-card-actions align="center" class="forgottenPasswordActions">
          <q-btn color="secondary" @click="$router.push({name: 'login'})" size="md" label="Ok" title="Retour à la page d'authentification" />
        </q-card-actions>
      </div>
    </q-card>
  </q-page>
</template>

<script>
// import api from '../../api'

export default {
  name: 'account-forgottenpassword',
  data () {
    return {
      isDisabled: false,
      email: null,
      errorNotification: null,
      finishedWithoutErrors: false
    }
  },
  computed: {},
  methods: {
    async submit () {
      this.isDisabled = true
      // let result = await api.forgottenpassword({})
      let result = 'eeddedededed'
      this.isDisabled = false
      if (result === true) {
        this.finishedWithoutErrors = true
      } else {
        this.errorNotification = this.$q.notify({type: 'negative', message: result, position: 'top', actions: [{ icon: 'mdi-close', handler: this.errorNotification }]})
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.avatar
  padding 10px
.avatar > img
  max-width 100px
  display inline
.forgottenPasswordCard /deep/ .q-card-main
  padding-bottom 0
.forgottenPasswordActions
  margin-bottom 10px
</style>
