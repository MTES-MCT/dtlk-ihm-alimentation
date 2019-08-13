<template>
  <q-modal v-model="opened" @show="onshow" @hide="onhide" maximized class="q-ma-lg">
    <q-modal-layout v-if="job">
      <q-toolbar slot="header" class="text-bold" :color="headerColor">
        <img :src="'statics/' + headerImg">
        <q-toolbar-title class="text-weight-medium text-white">
          {{status}}
          <div v-if="job.state.progress" slot="subtitle" class="q-caption">{{job.state.progress.step}}</div>
          <q-progress slot="subtitle" v-if="job.state.progress && job.state.progress.percentage" :percentage="job.state.progress.percentage" color="warning" class="q-mt-sm" />
        </q-toolbar-title>
        <q-btn flat @click="opened = false" :style="{zIndex: 3000}" color="white" icon="mdi-close-outline"></q-btn>
      </q-toolbar>
      <div>
        <q-list dense>
          <q-item>
            <q-item-side>
              <q-item-tile color="secondary" icon="mdi-numeric" />
            </q-item-side>
            <q-item-main :label="'Tâche n°' + String(job.id)" />
          </q-item>
          <q-item separator>
            <q-item-side>
              <q-item-tile color="secondary" icon="mdi-wrench" />
            </q-item-side>
            <q-item-main :label="type" />
          </q-item>
          <q-item>
            <q-item-main inset class="text-small">
              <q-item-tile label>Jeu de données</q-item-tile>
              <q-item-tile sublabel>{{dataset.title}} (id: {{dataset.id}})</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-main inset class="text-small">
              <q-item-tile label>Fichier de données</q-item-tile>
              <q-item-tile sublabel>{{datafileTitle}}<span v-if="datafileRid"> (rid: {{datafileRid}})</span></q-item-tile>
              <q-item-tile sublabel>Millesime {{job.data.datafile_millesime}}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-main inset class="text-small">
              <q-item-tile label>Fichier csv utilisé</q-item-tile>
              <q-item-tile sublabel>{{job.data.file_name}}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item separator>
            <q-item-side>
              <q-item-tile color="secondary" icon="mdi-calendar-clock" />
            </q-item-side>
            <q-item-main inset class="text-small">
              <q-item-tile sublabel>Créée le {{createdAt}}</q-item-tile>
              <q-item-tile v-if="startedAt" sublabel>Démarrée le {{startedAt}}</q-item-tile>
              <q-item-tile v-if="lastProgressAt" sublabel>Mise-à-jour le {{lastProgressAt}}</q-item-tile>
              <q-item-tile v-if="completedAt" sublabel>Terminée le {{completedAt}}</q-item-tile>
              <q-item-tile v-if="failedAt" sublabel>En échec le {{failedAt}}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item v-if="job.result" separator>
            <q-item-side>
              <q-item-tile color="secondary" icon="mdi-timer" />
            </q-item-side>
            <q-item-main inset class="text-small">
              <q-item-tile label>Durée: {{job.result.duration}} secondes</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item v-if="job.result" separator>
            <q-item-side>
              <q-item-tile color="secondary" icon="mdi-table-large" />
            </q-item-side>
            <q-item-main inset class="text-small">
              <q-item-tile sublabel>{{job.result.rows}} lignes intégrées</q-item-tile>
              <q-item-tile sublabel>{{job.result.columns}} colonnes créées à partir de {{job.result.csv_headers}} entêtes dans le fichier csv</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item v-if="job.error && job.error.message" separator>
            <q-item-side>
              <q-item-tile color="secondary" icon="mdi-alert-circle-outline" />
            </q-item-side>
            <q-item-main inset class="text-small">
              <q-item-tile label>{{job.error.message}}</q-item-tile>
            </q-item-main>
            <q-item-side v-if="job.error.list" right :icon="showErrorsList ? 'mdi-magnify-minus-outline' : 'mdi-magnify-plus-outline'" class="cursor-pointer" @click.native="showErrorsList = !showErrorsList" />
          </q-item>
          <q-collapsible v-if="job.error && job.error.list" label="Détail des erreurs">
            <div v-for="(error, i) of job.error.list.slice(0, 50)" :key="i" class="text-small">
              <q-icon name="mdi-square-small" /> Ligne {{error.line}}, colonne {{error.column}}: {{ error.message}}
            </div>
          </q-collapsible>
        </q-list>
      </div>
    </q-modal-layout>
  </q-modal>
</template>

<script>
export default {
  name: 'jobs-card',
  data () {
    return {
      showErrorsList: false
    }
  },
  computed: {
    opened: {
      get () {
        return this.$store.state.mydatasets.jobs.openModalDetailJob
      },
      set (value) {
        this.$store.commit('mydatasets/updateOpenModal', { open: value, modal: 'openModalDetailJob' })
      }
    },
    job () {
      return this.$store.state.mydatasets.jobs.usedJob
    },
    dataset () {
      return this.$store.state.mydatasets.list.find(dataset => dataset.id === this.job.data.dataset_id)
    },
    type () {
      if (this.job.data.task === 'addDatafileMillesime') return 'Ajout d\'un nouveau millesime d\'un fichier de données'
      if (this.job.data.task === 'replaceDatafileMillesime') return 'Remplacement d\'un millesime d\'un fichier de données'
      if (this.job.data.task === 'createDatafile') return 'Ajout d\'un nouveau fichier de données'
    },
    status () {
      if (['delayed', 'created', 'inactive'].includes(this.job.state.status)) return 'Tâche en file d\'attente'
      if (this.job.state.status === 'active') return 'Tâche en cours de traitement'
      if (this.job.state.status === 'complete') return 'Tâche terminée avec succès'
      if (this.job.state.status === 'failed') return 'Tâche terminée en erreur'
    },
    headerImg () {
      if (['delayed', 'created', 'inactive', 'active'].includes(this.job.state.status)) return 'pacman.svg'
      if (this.job.state.status === 'complete') return 'happy.png'
      if (this.job.state.status === 'failed') return 'angry.png'
    },
    headerColor () {
      if (['delayed', 'created', 'inactive', 'active'].includes(this.job.state.status)) return 'secondary'
      if (this.job.state.status === 'complete') return 'positive'
      if (this.job.state.status === 'failed') return 'negative'
    },
    datafileTitle () {
      if (['replaceDatafileMillesime', 'addDatafileMillesime'].includes(this.job.data.task)) return this.dataset.datafiles.find(datafile => datafile.rid === this.job.data.datafile_rid).title
      if (this.job.data.task === 'createDatafile') return this.job.data.datafile_metadata.title
    },
    datafileRid () {
      if (['replaceDatafileMillesime', 'addDatafileMillesime'].includes(this.job.data.task)) return this.dataset.datafiles.find(datafile => datafile.rid === this.job.data.datafile_rid).rid
      if ((this.job.data.task === 'createDatafile') && this.job.result) return this.job.result.rid
    },
    createdAt () {
      let d = new Date(this.job.state.created_at)
      return d.toLocaleString('fr-FR')
    },
    startedAt () {
      if (!this.job.state.started_at) return null
      let d = new Date(this.job.state.started_at)
      return d.toLocaleString('fr-FR')
    },
    completedAt () {
      if (this.job.state.status !== 'complete') return null
      return this.updatedAt
    },
    failedAt () {
      if (this.job.state.status !== 'failed') return null
      return this.updatedAt
    },
    lastProgressAt () {
      if (this.job.state.status !== 'active') return null
      return this.updatedAt
    },
    updatedAt () {
      let d = new Date(this.job.state.updated_at)
      return d.toLocaleString('fr-FR')
    },
    duration () {
      if (this.job.state.status !== 'complete') return null
      return this.job.result.duration
    }
  },
  methods: {
    onshow () {
      console.log('open')
    },
    onhide () {
      console.log('close')
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
