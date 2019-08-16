<template>
  <q-page class="q-pa-xl bg-grey-1">
    <div class="q-display-2 q-mb-md text-secondary">Mon tableau de bord</div>
    <div class="row gutter-md">
      <div class="col-xs-12 cols-sm-12 col-md-6 col-lg-4">
        <q-alert class="mybox cursor-pointer" color="info" icon="mdi-folder" @click.native="$router.push({name: 'myorgdatasets'})" >
          <div class="q-title">Mes jeux de données</div>
          <div class="q-caption">Administrer les jeux de données de vos organisations</div>
          <q-chip square color="info" text-color="white" class="mychip q-mt-sm">
            {{$store.state.me.datasets}}
          </q-chip>
        </q-alert>
      </div>
      <div class="col-xs-12 cols-sm-12 col-md-6 col-lg-4">
        <q-alert class="mybox cursor-pointer" color="warning" icon="mdi-wrench" @click.native="$router.push({name: 'myjobs'})" >
          <div class="q-title">Mes tâches d'intégration</div>
          <div class="q-caption">Consulter vos tâches d'intégration dans le Datalake</div>
          <q-chip square color="warning" text-color="white" class="mychip q-mt-sm">
            {{$store.state.me.jobs}}
          </q-chip>
        </q-alert>
      </div>
      <div class="col-xs-12 cols-sm-12 col-md-6 col-lg-4">
        <q-alert class="mybox cursor-pointer" color="positive" icon="mdi-clock" @click.native="$router.push({name: 'myalerts'})" >
          <div class="q-title">Mes alertes</div>
          <div class="q-caption">Jeux de données qui doivent être mis-à-jour dans moins d'une semaine</div>
          <q-chip square color="positive" text-color="white" class="mychip q-mt-sm">
            {{$store.state.me.alerts}}
          </q-chip>
        </q-alert>
      </div>
      <div class="col-xs-12 cols-sm-12 col-md-6 col-lg-4">
        <q-alert class="mybox cursor-pointer" color="secondary" icon="mdi-message" @click.native="$router.push({name: 'mymessages'})" >
          <div class="q-title">Mes messages</div>
          <div class="q-caption">Voir vos messages provenant du Datalake</div>
          <q-chip square color="secondary" text-color="white" class="relative-position mychip q-mt-sm">
            {{totalMessages}}
            <q-chip v-if="unreadMessages" floating color="primary">+ {{unreadMessages}}</q-chip>
          </q-chip>
        </q-alert>
      </div>
      <div class="col-xs-12 cols-sm-12 col-md-6 col-lg-4">
        <q-alert class="mybox cursor-pointer" color="primary" icon="mdi-account" @click.native="$router.push({name: 'myaccount'})" >
          <div class="q-title">Mon compte</div>
          <div class="q-caption">Consulter les informations de votre compte d'accès au Datalake</div>
          <div class="q-display-1"></div>
        </q-alert>
      </div>
      <div class="col-xs-12 cols-sm-12 col-md-6 col-lg-4">
        <a href="http://statistiques.metier.e2.rie.gouv.fr/le-systeme-d-information-r311.html">
          <q-alert class="mybox cursor-pointer" color="light" icon="mdi-file-tree"  >
            <div class="q-title">Accéder à la documentation du datalake</div>
            <div class="q-display-1"></div>
          </q-alert>
        </a>
      </div>
    </div>

  </q-page>
</template>

<script>
export default {
  name: 'my-panel',
  data () {
    return {}
  },
  computed: {
    unreadMessages: function () {
      return this.$store.getters['me/unreadMessages']
    },
    totalMessages: function () {
      return this.$store.getters['me/totalMessages']
    }
  },
  activated () {
    this.$store.dispatch('me/initializeInfos')
  },
  methods: {}
}
</script>

<style scoped lang="stylus">
@import '~variables'
@import '~quasar-styl'
.mybox /deep/ .q-alert
  min-height 90px
.mybox /deep/ .q-icon
  font-size 36px
.mychip
  font-size 2em
  @extend .text-bold
  /deep/ .q-chip-floating
    right -1.3em

a
  text-decoration none

</style>
