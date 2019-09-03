<template>
  <div class="full-width bg-white row reverse items-center justify-between no-wrap">
    <div class="col-auto q-pa-xs">
      <q-btn class="on-left" icon="mdi-menu" color="secondary" title="Menu" >
        <q-popover ref="popovermenu">
          <q-list class="listMenu text-secondary">
            <q-item v-if="$route.name !== 'mypanel'" @click.native="[$refs.popovermenu.hide(), $router.push({name: 'mypanel'})]" class="cursor-pointer" title="Mon tableau de bord">
              <q-item-side icon="mdi-view-dashboard" />
              <q-item-main label="Mon tableau de bord" />
            </q-item>
            <q-item-separator v-if="$route.name !== 'mypanel'" />
            <q-item v-if="$route.name !== 'myorgdatasets'" @click.native="[$refs.popovermenu.hide(), $router.push({name: 'myorgdatasets'})]" class="cursor-pointer" title="Administrer les jeux de données de mon organisation">
              <q-item-side icon="mdi-folder" />
              <q-item-main label="Mes jeux de données" sublabel="Administrer mes jeux de données" />
            </q-item>
            <q-item v-if="$route.name !== 'myjobs'" @click.native="[$refs.popovermenu.hide(), $router.push({name: 'myjobs'})]" class="cursor-pointer" title="Voir vos tâches d'intégration">
              <q-item-side icon="mdi-wrench" />
              <q-item-main label="Mes tâches d'intégration" sublabel="Voir vos tâches d'intégration" />
            </q-item>
            <q-item v-if="$route.name !== 'myalerts'" @click.native="[$refs.popovermenu.hide(), $router.push({name: 'myalerts'})]" class="cursor-pointer" title="Voir vos alertes">
              <q-item-side icon="mdi-clock" />
              <q-item-main label="Mes alertes" sublabel="Voir vos alertes" />
            </q-item>
            <q-item v-if="$route.name !== 'mymessages'" @click.native="[$refs.popovermenu.hide(), $router.push({name: 'mymessages'})]" class="cursor-pointer" title="Voir vos messages">
              <q-item-side icon="mdi-message" />
              <q-item-main label="Mes messages" sublabel="Voir vos messages" />
            </q-item>
            <q-item v-if="$route.name !== 'myaccount'" @click.native="[$refs.popovermenu.hide(), $router.push({name: 'myaccount'})]" class="cursor-pointer" title="Administrer mon compte">
              <q-item-side icon="mdi-account" />
              <q-item-main label="Mon compte" sublabel="Administrer mon compte" />
            </q-item>
            <q-item-separator />
            <a href="http://statistiques.metier.e2.rie.gouv.fr/documentation-r553.html" >
            <q-item v-if="$route.name !== 'explore'" @click.native="[$refs.popovermenu.hide()]" class="cursor-pointer" title="Accéder à la documentation du datalake" >
                <q-item-side icon="mdi-file-tree" />
                <q-item-main label="Accéder à la documentation du datalake" />
            </q-item>
            </a>
            <q-item-separator v-if="$route.name !== 'explore'" />
            <q-item @click.native="$router.push({name: 'logout'})" class="cursor-pointer">
              <q-item-side icon="mdi-logout" />
              <q-item-main label="Déconnexion" sublabel="Se déconnecter de l'application"  title="Me déconnecter de l'application" />
            </q-item>
          </q-list>
        </q-popover>
      </q-btn>
    </div>
    <img src='statics/datalake.ecologie-header.svg' class="logoDatalake bg-white vertical-top q-mb-xs q-mt-xs" />
  </div>
</template>

<script>
export default {
  name: 'layout-banner-menu-button',
  components: {},
  data () {
    return {}
  },
  computed: {},
  methods: {}
}
</script>

<style scoped lang="stylus">
.logoDatalake
  max-width 500px
  min-height 61px
.listMenu
  min-width 200px
a
  text-decoration none
  color #cf641c
</style>
