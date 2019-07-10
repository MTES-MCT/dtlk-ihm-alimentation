<template>
  <q-page class="q-pa-xl bg-grey-1">
    <div class="q-display-2 q-mb-md text-secondary">Mon compte</div>
    <div class="row profile bg-white">
      <div class="col-auto avatar text-center self-center">
        <img src="statics/profile.png">
      </div>
      <div class="col-auto q-pa-sm self-center">
        <q-item>
          <q-item-side icon="mdi-account" color="faded" />
          <q-item-main>
            <q-item-tile color="faded" class="text-weight-bold breakall">{{user.first_name}} {{user.last_name}}</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side icon="mdi-email" color="faded" />
          <q-item-main>
            <q-item-tile color="faded" class="text-weight-bold breakall">{{user.email}}</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side icon="mdi-calendar-check" color="faded" />
          <q-item-main>
            <q-item-tile class="breakall" color="faded">Enregistré depuis <span class="text-weight-bold">{{since}}</span></q-item-tile>
          </q-item-main>
        </q-item>
        <q-item dense>
          <q-item-side icon="mdi-account-multiple" color="faded" />
          <q-item-main>
            <q-item-tile label class="text-weight-bold text-faded">Vos organisations</q-item-tile>
            <q-item-tile ref="apikey" v-for="organization in user.organizations" :key="organization.id" sublabel class="breakall" color="faded">Membre de <span class="text-weight-bold">{{organization.title}}</span></q-item-tile>
          </q-item-main>
        </q-item>
      </div>
      <div class="col-12 q-pa-sm">
        <q-item-separator />
        <div class="row gutter-xs items-center">
          <div class="q-caption col-12">
            Pour pouvoir alimenter le Datalake à partir d'autres outils (scripts R ou macros SAS par example), vous aurez besoin de connaître votre clé d'API.
          </div>
          <div class="col-auto">
            <q-btn class="q-caption" size="sm" :label="showApiKey ? 'cacher la clé' : 'afficher la clé'" flat dense no-caps color="primary" @click="showApiKey = !showApiKey"/>
          </div>
        </div>
        <q-item v-if="showApiKey">
          <q-item-side icon="mdi-key-variant" />
          <q-item-main>
            <q-item-tile label color="faded">Votre clé d'API</q-item-tile>
            <q-item-tile sublabel color="secondary" class="text-weight-bold breakword">{{apiKey}}</q-item-tile>
          </q-item-main>
          <q-item-side right icon="mdi-clipboard-text" title="copier votre clé dans le press papier" class="cursor-pointer" @click.native="copyApiKeyToClipboard()" />
        </q-item>
      </div>
    </div>
  </q-page>
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'my-account',
  data () {
    return {
      user: this.$store.getters['auth/user'],
      apiKey: this.$store.getters['auth/apiKey'],
      showApiKey: false
    }
  },
  computed: {
    since () {
      return date.formatDate(this.user.since, 'dddd DD MMMM YYYY à HH:mm:ss')
    }
  },
  methods: {
    copyApiKeyToClipboard () {
      let el = document.createElement('textarea')
      el.value = this.apiKey
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      this.$q.notify({ type: 'info', message: 'Votre clé d\'api a été copiée dans le press-papier', position: 'top', icon: 'mdi-information' })
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~variables'
@import '~quasar-styl'
.profile
  border 1px solid $secondary
  @extend .round-borders
  @extend .shadow-6
.avatar
  padding 10px
.avatar > img
  max-width 150px
  display inline
.profile /deep/ .q-item-main
  @extend .q-caption
.breakword
  word-wrap break-word
.breakall
  word-break break-all
.separator
  border-bottom 1px solid $secondary
</style>
