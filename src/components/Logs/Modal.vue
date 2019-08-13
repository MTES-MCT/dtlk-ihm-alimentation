<template>
  <q-modal v-model="opened" @show="onshow" @hide="onhide" minimized position-classes="justify-center" :content-css="{marginTop: '15px', minHeight: '200px', minWidth: '95vw'}">
    <div>
      <q-list separator no-border>
        <q-list-header class="text-secondary">Historique des modifications<q-btn class="float-right" flat @click="opened = false"><q-icon name="mdi-close-outline" /></q-btn></q-list-header>
        <q-item-separator />
        <q-item v-show="!loading" v-for="log of logs" :key="log.id">
          <q-item-side :color="color(log)" :icon="icon(log)" />
          <q-item-main>
            <q-item-tile class="q-caption" label :text-color="color(log)">{{text(log)}}</q-item-tile>
          </q-item-main>
          <q-item-side right class="text-center">
            <q-chip square :color="color(log)" icon="mdi-calendar-clock" class="q-caption">
              {{displayDate(log)}}<br>{{displayTime(log)}}
            </q-chip>
          </q-item-side>
        </q-item>
      </q-list>
      <div v-show="!loading && (logs.length === 0)" class="text-center">
        <q-btn small outline @click="load" color="secondary"><q-icon name="mdi-refresh" class="on-left" />Recharger</q-btn>
      </div>
      <q-inner-loading :visible="loading">
        <q-spinner-gears :size="50" color="secondary" />
        <br><br>
        <div class="text-secondary full-width text-center">Chargement de l'historique des modifications en cours...</div>
      </q-inner-loading>
    </div>
  </q-modal>
</template>

<script>
import api from '../../api'
import { date, Notify } from 'quasar'

export default {
  name: 'logs-modal',
  data () {
    return {
      logs: [],
      loading: true
    }
  },
  computed: {
    opened: {
      get () {
        return this.$store.state.mydatasets.openModalShowLogs
      },
      set (value) {
        this.$store.commit('mydatasets/updateOpenModal', { open: value, modal: 'openModalShowLogs' })
      }
    }
  },
  methods: {
    async onshow () {
      console.log('open')
      this.load()
    },
    onhide () {
      this.logs = []
      this.loading = true
      console.log('close')
    },
    async load () {
      this.loading = true
      try {
        if (this.$store.state.mydatasets.usedObjectLog.dataset && this.$store.state.mydatasets.usedObjectLog.datafile) this.logs = await api.getdatafilelogs(this.$store.getters['auth/apiKey'], this.$store.state.mydatasets.usedObjectLog.dataset.id, this.$store.state.mydatasets.usedObjectLog.datafile.rid)
        if (this.$store.state.mydatasets.usedObjectLog.dataset && this.$store.state.mydatasets.usedObjectLog.attachment) this.logs = await api.getattachmentlogs(this.$store.getters['auth/apiKey'], this.$store.state.mydatasets.usedObjectLog.dataset.id, this.$store.state.mydatasets.usedObjectLog.attachment.rid)
        if (this.$store.state.mydatasets.usedObjectLog.dataset && !this.$store.state.mydatasets.usedObjectLog.datafile && !this.$store.state.mydatasets.usedObjectLog.attachment) this.logs = await api.getdatasetlogs(this.$store.getters['auth/apiKey'], this.$store.state.mydatasets.usedObjectLog.dataset.id)
        this.logs.reverse()
      } catch (error) {
        Notify.create({ type: 'negative', message: error.message, position: 'top', actions: [{ icon: 'mdi-close-outline', handler: () => {} }] })
      }
      this.loading = false
    },
    color (log) {
      if (['create_dataset', 'add_attachment', 'add_datafile', 'add_datafile_millesime'].includes(log.type)) return 'positive'
      if (['update_dataset_metadata', 'update_attachment_metadata', 'update_attachment_file', 'update_datafile_metadata', 'replace_datafile_millesime'].includes(log.type)) return 'primary'
      if (['delete_dataset', 'delete_attachment', 'delete_datafile_millesime', 'delete_datafile'].includes(log.type)) return 'negative'
    },
    icon (log) {
      if (['create_dataset', 'update_dataset_metadata', 'delete_dataset'].includes(log.type)) return 'mdi-folder'
      if (['add_datafile', 'add_datafile_millesime', 'update_datafile_metadata', 'update_datafile_millesime', 'delete_datafile_millesime', 'delete_datafile'].includes(log.type)) return 'mdi-chart-bar'
      if (['add_attachment', 'update_attachment_metadata', 'update_attachment_file', 'delete_attachment'].includes(log.type)) return 'mdi-attachment'
    },
    text (log) {
      if (log.type === 'create_dataset') return `Création du jeu de données ${log.dataset.title}`
      if (log.type === 'add_attachment') return `Ajout du fichier descriptif ${log.attachment.title}`
      if (log.type === 'add_datafile') return `Ajout du fichier de données ${log.datafile.title}`
      if (log.type === 'add_datafile_millesime') return `Ajout du millesime ${log.datafile.millesime} du fichier de données ${log.datafile.title}`
      if (log.type === 'update_dataset_metadata') return `Mis-à-jour du jeu de données ${log.dataset.title}`
      if (log.type === 'update_attachment_metadata') return `Mise-à-jour des métadonnées du fichier descriptif ${log.attachment.title}`
      if (log.type === 'update_attachment_file') return `Remplacement du fichier descriptif ${log.attachment.title}`
      if (log.type === 'update_datafile_metadata') return `Mise-à-jour des métadonnées du fichier de données ${log.datafile.title}`
      if (log.type === 'update_datafile_millesime') return `Remplacement du millesime ${log.datafile.millesime} du fichier de données ${log.datafile.title}`
      if (log.type === 'delete_dataset') return `Suppression du jeu de données ${log.dataset.title}`
      if (log.type === 'delete_attachment') return `Suppression du fichier descriptif ${log.attachment.title}`
      if (log.type === 'delete_datafile_millesime') return `Suppression du millesime ${log.datafile.millesime} du fichier de données ${log.datafile.title}`
      if (log.type === 'delete_datafile') return `Suppression du fichier de données ${log.datafile.title}`
    },
    displayDate (log) {
      return date.formatDate(new Date(log.timestamp), 'DD MMMM YYYY')
    },
    displayTime (log) {
      return date.formatDate(new Date(log.timestamp), 'HH:mm')
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
