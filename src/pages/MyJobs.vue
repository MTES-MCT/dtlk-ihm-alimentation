<template>
  <q-page class="q-pa-md bg-grey-1">
    <jobs-card />
    <q-list link separator no-border>
      <q-list-header>
        <div class="q-headline text-secondary">Vos tâches d'intégration dans le Datalake</div>
        <div v-if="jobs.length" clas="q-caption">cliquez sur une tâche pour voir le détail</div>
        <div v-else>Vous n'avez pas de tâches d'intégration</div>
      </q-list-header>
      <jobs-row v-for="job in jobs" :key="job.id" :job="job" />
    </q-list>
    <q-inner-loading :visible="loading">
      <q-spinner-gears :size="50" color="secondary" />
      <br><br>
      <div class="text-secondary full-width text-center">Chargement de vos tâches d'intégration. Merci de patienter...</div>
    </q-inner-loading>
  </q-page>
</template>

<script>
import JobsCard from 'components/Jobs/Card'
import JobsRow from 'components/Jobs/Row'

export default {
  name: 'my-jobs',
  components: { JobsCard, JobsRow },
  data () {
    return {}
  },
  computed: {
    jobs () {
      return this.$store.state.mydatasets.jobs.list.slice(0).sort((joba, jobb) => jobb.id - joba.id)
    },
    loading () {
      return this.$store.state.mydatasets.jobs.pending_list
    }
  },
  created () {
    this.$store.dispatch('mydatasets/initialize')
  }
}
</script>

<style scoped lang="stylus">

</style>
