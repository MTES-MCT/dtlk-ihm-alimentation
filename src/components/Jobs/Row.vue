<template>
  <q-item @click.native="openModalJob">
    <q-item-side :color="colorStatus" :icon="iconStatus" />
    <q-item-main class="text-small">
      <q-item-tile label :text-color="colorStatus">Tâche n°{{job.id}}</q-item-tile>
      <q-item-tile sublabel>{{typeText}}</q-item-tile>
      <q-item-tile sublabel>Fichier utilisé: {{job.data.file_name}}</q-item-tile>
    </q-item-main>
  </q-item>
</template>

<script>
export default {
  name: 'jobs-row',
  props: ['job'],
  data () {
    return {}
  },
  computed: {
    iconStatus: function () {
      if (this.job.state.status === 'complete') return 'mdi-check-decagram'
      if (this.job.state.status === 'failed') return 'mdi-alert-decagram'
      return 'mdi-sync'
    },
    colorStatus: function () {
      if (this.job.state.status === 'complete') return 'positive'
      if (this.job.state.status === 'failed') return 'negative'
      return 'info'
    },
    typeText: function () {
      let text = ''
      if (this.job.data.task === 'createDatafile') {
        text = `Ajout du fichier de données ${this.job.data.datafile_metadata.title} dans le jeu de donnée identifié par ${this.job.data.dataset_id}`
      }
      if (this.job.data.task === 'replaceDatafileMillesime') {
        text = `Remplacement de la millesime ${this.job.data.datafile_millesime} du fichier de données ${this.job.data.datafile_rid} dans le jeu de donnée  ${this.job.data.dataset_id}`
      }
      if (this.job.data.task === 'addDatafileMillesime') {
        text = `Ajout d'une millesime au fichier de données ${this.job.data.datafile_rid} dans le jeu de donnée  ${this.job.data.dataset_id}`
      }
      return text
    }
  },
  methods: {
    openModalJob: function () {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalDetailJob', usedJob: this.job })
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
