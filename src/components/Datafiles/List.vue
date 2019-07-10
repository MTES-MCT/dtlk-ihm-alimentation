<template>
  <q-list dense no-border class="no-padding q-mb-xs">
    <transition-group appear enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
      <q-item v-if="!datafiles || !datafiles.length" key="nodatafile" dense class="q-caption q-px-none q-py-xs">
        <q-item-main inset>
          <q-item-tile class="text-black text-weight-bold" label>Aucun fichier de données n'est associé à ce jeu de données</q-item-tile>
        </q-item-main>
      </q-item>
      <q-item v-if="dataset.jobinprogress" :key="`newdatafile_${dataset.jobinprogress.id}`"  dense class="q-caption q-px-none q-py-xs jobinprogress">
        <q-item-side color="primary" class="text-center cursor-pointer" @click.native="openJobInProgress()">
          <q-spinner-dots :size="16" />
        </q-item-side>
        <q-item-main>
          <q-item-tile class="text-secondary text-weight-medium" label>Ajout d'un fichier de données en cours</q-item-tile>
        </q-item-main>
      </q-item>
      <q-item v-for="(job, i) in dataset.jobserror" :key="job.id" dense class="q-caption q-px-none q-py-xs joberror" :class="{lastjoberror: i === (dataset.jobserror.length - 1) }">
        <q-item-main inset>
          <q-item-tile class="text-negative text-weight-bold" label>erreur lors de l'ajout d'un fichier de données</q-item-tile>
          <q-item-tile sublabel><span class="cursor-pointer" @click="openJobInError(job)">voir les détails</span> | <span class="cursor-pointer" @click="removeJobInError(job)">supprimer l'alerte</span></q-item-tile>
        </q-item-main>
      </q-item>
      <datafiles-row v-for="datafile in datafiles" :key="datafile.rid" :dataset="dataset" :datafile="datafile" />
    </transition-group>
  </q-list>
</template>

<script>
import DatafilesRow from 'components/Datafiles/Row'

export default {
  name: 'datafiles-list',
  props: ['datafiles', 'dataset'],
  components: { DatafilesRow },
  data () {
    return {}
  },
  created: function () {},
  methods: {
    openJobInProgress () {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalDetailJob', usedJob: this.dataset.jobinprogress })
    },
    openJobInError (job) {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalDetailJob', usedJob: job })
    },
    removeJobInError (job) {
      this.$store.commit('mydatasets/removeErrorAddDatafile', { dataset: this.dataset, job: job })
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~variables'
.q-item.jobinprogress, .q-item.joberror.lastjoberror
  border-bottom 1px dashed $light
.q-item.jobinprogress:last-child, .q-item.joberror.lastjoberror:last-child
  border-bottom none
</style>
