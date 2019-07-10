<template>
  <q-page class="q-pa-md bg-grey-1">
    <q-list link separator no-border>
      <q-list-header>
        <div class="q-headline text-secondary">Jeux de données qui doivent être mis-à-jour dans moins d'une semaine</div>
        <div v-if="datasets.length" clas="q-caption">cliquez sur un jeu de données pour l'administrer</div>
        <div v-else>Vous n'avez pas d'alertes</div>
      </q-list-header>
      <datasets-simple-row v-for="dataset in datasets" :key="dataset.id" :dataset="dataset" />
    </q-list>
    <q-inner-loading :visible="loading">
      <q-spinner-gears :size="50" color="secondary" />
      <br><br>
      <div class="text-secondary full-width text-center">Chargement de vos alertes. Merci de patienter...</div>
    </q-inner-loading>
  </q-page>
</template>

<script>
import DatasetsSimpleRow from 'components/Datasets/SimpleRow'
export default {
  name: 'my-alerts',
  components: { DatasetsSimpleRow },
  data () {
    return {}
  },
  computed: {
    datasets () {
      return this.$store.getters['mydatasets/alerts'].slice(0).sort((alert1, alert2) => (new Date(alert1.frequency_date)).getTime() > (new Date(alert2.frequency_date)).getTime())
    },
    loading () {
      return this.$store.state.mydatasets.pending_list
    }
  },
  created () {
    this.$store.dispatch('mydatasets/initialize')
  }
}
</script>

<style scoped lang="stylus">

</style>
