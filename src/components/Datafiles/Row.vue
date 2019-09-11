<template>
  <q-item highlight dense multiline class="q-caption q-px-none q-py-xs" :class="{'animated infinite mypulse': datafile.notify_update}">
    <template v-if="datafile.pending_delete_millesime">
      <q-item-side color="secondary" class="text-center">
        <q-spinner-hourglass size="16" />
      </q-item-side>
      <q-item-main>
        <q-item-tile class="text-secondary text-weight-medium" label>{{datafile.title}}</q-item-tile>
        <q-item-tile class="text-secondary text-bold" sublabel>Suppression du dernier millesime du fichier en cours</q-item-tile>
      </q-item-main>
    </template>
    <template v-else-if="datafile.pending_delete">
      <q-item-side color="secondary" class="text-center">
        <q-spinner-hourglass size="16" />
      </q-item-side>
      <q-item-main>
        <q-item-tile class="text-secondary text-weight-medium" label>{{datafile.title}}</q-item-tile>
        <q-item-tile class="text-secondary text-bold" sublabel>Suppression du fichier en cours</q-item-tile>
      </q-item-main>
    </template>
    <template v-else-if="datafile.jobinprogress">
      <q-item-side color="primary" class="text-center cursor-pointer" @click.native="openJobInProgress()">
        <q-spinner-dots :size="16" />
      </q-item-side>
      <q-item-main>
        <q-item-tile class="text-secondary text-weight-medium" label>{{datafile.title}}</q-item-tile>
        <q-item-tile class="text-secondary text-bold" sublabel>{{textMillesimeInProgress}}</q-item-tile>
      </q-item-main>
    </template>
    <template v-else>
      <q-item-main inset>
        <q-item-tile class="text-secondary text-weight-medium" label>{{datafile.title}}</q-item-tile>
        <q-item-tile v-if="datafile.millesimes > 1" sublabel><span>{{datafile.millesimes}} millesimes</span></q-item-tile>
        <q-list v-if="datafile.jobserror.length > 0" dense no-border class="no-padding q-mb-xs">
          <q-item v-for="(job, i) in datafile.jobserror" :key="job.id" dense class="q-caption q-px-none q-py-xs joberror" :class="{lastjoberror: i === (dataset.jobserror.length - 1) }">
            <q-item-main>
              <q-item-tile class="text-negative text-weight-bold" label>{{jobErrorText(job)}}</q-item-tile>
              <q-item-tile sublabel><span class="cursor-pointer" @click="openJobInError(job)">voir les détails</span> | <span class="cursor-pointer" @click="removeJobInError(job)">supprimer l'alerte</span></q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
      </q-item-main>
      <q-item-side right icon="mdi-dots-vertical" class="cursor-pointer">
        <q-popover ref="popoverDatafile">
          <q-list link dense class="no-border datafileActions">
            <q-item dense class="q-caption" @click.native="[$refs.popoverDatafile.hide(), openDetail()]">
              <q-item-side icon="mdi-magnify" />
              <q-item-main>
                <q-item-tile label>Détail</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item dense class="q-caption" @click.native="[$refs.popoverDatafile.hide(), openEditMetadata()]">
              <q-item-side icon="mdi-pencil" />
              <q-item-main>
                <q-item-tile label>Éditer les métadonnées</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item dense class="q-caption" @click.native="[$refs.popoverDatafile.hide(), openAddMillesimeDatafile()]">
              <q-item-side icon="mdi-new-box" />
              <q-item-main>
                <q-item-tile label>Ajouter un millesime</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item dense class="q-caption">
              <q-item-side icon="mdi-cloud-sync" />
              <template v-if="datafile.millesimes === 1">
                <q-item-main >
                  <q-item-tile label @click.native="[$refs.popoverDatafile.hide(), openReplaceMillesimeDatafile(millesimes[0])]">Remplacer le fichier</q-item-tile>
                </q-item-main>
              </template>
              <template v-else>
                <q-item-main>
                  <q-item-tile label>Remplacer le fichier d'un millesime</q-item-tile>
                </q-item-main>
                <q-item-side right icon="mdi-menu-down" />
                <q-popover ref="popoverDatafileMillesimes" anchor="bottom right" self="top right">
                  <q-list link dense class="no-border">
                    <q-item dense class="q-caption" v-for="millesime of millesimes" :key="millesime" @click.native="[$refs.popoverDatafileMillesimes.hide(), openReplaceMillesimeDatafile(millesime)]">
                      <q-item-main>
                        <q-item-tile label>millesime {{millesime}}</q-item-tile>
                      </q-item-main>
                    </q-item>
                  </q-list>
                </q-popover>
              </template>
            </q-item>
            <q-item-separator/>
            <q-item dense class="q-caption" v-if="datafile.millesimes > 1">
                <q-item-side color="negative" icon="mdi-delete" />
                <q-item-main>
                  <q-item-tile color="negative" label>Supprimer un millesime du fichier de données</q-item-tile>
                </q-item-main>
                <q-item-side right color="negative" icon="mdi-menu-down" />
                <q-popover ref="popoverDatafileMillesimes" anchor="bottom right" self="top right">
                      <q-list link dense class="no-border">
                        <q-item dense class="q-caption" v-for="millesime of millesimes" :key="millesime" @click.native="[$refs.popoverDatafileMillesimes.hide(), confirmLastMillesimeDeletion(millesime)]">
                          <q-item-main>
                            <q-item-tile label>millesime {{millesime}}</q-item-tile>
                          </q-item-main>
                        </q-item>
                      </q-list>
                </q-popover>
            </q-item>
            <q-item dense class="q-caption" @click.native="[$refs.popoverDatafile.hide(), confirmDeletion()]">
              <q-item-side color="negative" icon="mdi-delete" />
              <q-item-main>
                <q-item-tile color="negative" label>Supprimer le fichier de données</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item-separator />
            <q-item dense class="q-caption" @click.native="[$refs.popoverDatafile.hide(), showLogs()]">
              <q-item-side color="primary" icon="mdi-history" />
              <q-item-main>
                <q-item-tile color="primary" label>Voir les logs</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-popover>
      </q-item-side>
    </template>
  </q-item>
</template>

<script>
export default {
  name: 'datafiles-row',
  props: ['datafile', 'dataset'],
  components: {},
  data () {
    return {}
  },
  computed: {
    millesimes () {
      let listMillesime = this.datafile.millesimes_info.reduce((accumulatorMillesimes, currentMillesime) => {
        accumulatorMillesimes.push(currentMillesime.millesime)
        return accumulatorMillesimes
      }, [])
      return listMillesime
    },
    textMillesimeInProgress () {
      if (this.datafile.jobinprogress) {
        if (this.datafile.jobinprogress.data.task === 'replaceDatafileMillesime') {
          if (this.datafile.millesimes === 1) return `Remplacement du fichier en cours`
          else return `Remplacement de la millesime ${this.datafile.jobinprogress.data.datafile_millesime} du fichier en cours`
        }
        if (this.datafile.jobinprogress.data.task === 'addDatafileMillesime') return `Ajout du millesime ${this.datafile.jobinprogress.data.datafile_millesime} en cours`
      }
      return null
    }
  },
  methods: {
    openDetail () {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalDetailDatafile', usedDatafile: { dataset: this.dataset, datafile: this.datafile } })
    },
    openEditMetadata () {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalEditDatafile', usedDatafile: { dataset: this.dataset, datafile: this.datafile, millesime: null } })
    },
    openReplaceMillesimeDatafile (millesime) {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalReplaceMillesimeDatafile', usedDatafile: { dataset: this.dataset, datafile: this.datafile, millesime: millesime } })
    },
    openAddMillesimeDatafile () {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalAddMillesimeDatafile', usedDatafile: { dataset: this.dataset, datafile: this.datafile, millesime: null } })
    },
    openJobInProgress () {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalDetailJob', usedJob: this.datafile.jobinprogress })
    },
    openJobInError (job) {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalDetailJob', usedJob: job })
    },
    removeJobInError (job) {
      this.$store.commit('mydatasets/removeErrorEditDatafile', { datafile: this.datafile, job: job })
    },
    jobErrorText (job) {
      if (job.data.task === 'replaceDatafileMillesime') return `erreur lors du remplacement du millesime ${job.data.datafile_millesime}`
      if (job.data.task === 'addDatafileMillesime') return `erreur lors de l'ajout du millesime ${job.data.datafile_millesime}`
    },
    async confirmLastMillesimeDeletion (millesime) {
      try {
        await this.$q.dialog({
          title: 'Demande de confirmation',
          color: 'secondary',
          message: 'Vous allez supprimer définitivement le millesime ' + millesime + ' du fichier de données. Êtes-vous sûr ?',
          ok: 'Oui',
          cancel: 'Non, annuler !!'
        })
        await this.$store.dispatch('mydatasets/removeDatafileMillesime', { dataset: this.dataset, datafile: this.datafile, millesimeToRemove: millesime })
      } catch (e) {}
    },
    async confirmDeletion () {
      try {
        await this.$q.dialog({
          title: 'Demande de confirmation',
          color: 'secondary',
          message: 'Vous allez supprimer définitivement le fichier de données. Êtes-vous sûr ?',
          ok: 'Oui',
          cancel: 'Non, annuler !!'
        })
        await this.$store.dispatch('mydatasets/removeDatafile', { dataset: this.dataset, datafile: this.datafile })
      } catch (e) {}
    },
    showLogs () {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalShowLogs', usedObjectLog: { dataset: this.dataset, datafile: this.datafile, millesime: null } })
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~quasar-styl'
.datafileActions /deep/ .q-item .q-icon
  @extend .q-subheading
.datafileActions /deep/ .q-item-side-left
  min-width unset
</style>
