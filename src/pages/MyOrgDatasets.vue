<template>
  <q-page class="q-pa-md bg-grey-1">
    <datasets-write v-if="$store.state.mydatasets.openModalWritingDataset" />
    <attachments-detail v-if="$store.state.mydatasets.openModalDetailAttachment" />
    <attachments-add v-if="$store.state.mydatasets.openModalAddAttachment"/>
    <attachments-edit-metadata v-if="$store.state.mydatasets.openModalEditAttachment" />
    <attachments-replace-file v-if="$store.state.mydatasets.openModalReplaceAttachment" />
    <datafiles-detail v-if="$store.state.mydatasets.openModalDetailDatafile" />
    <datafiles-add v-if="$store.state.mydatasets.openModalAddDatafile" />
    <datafiles-edit-metadata v-if="$store.state.mydatasets.openModalEditDatafile" />
    <datafiles-add-millesime v-if="$store.state.mydatasets.openModalAddMillesimeDatafile" />
    <datafiles-replace-millesime v-if="$store.state.mydatasets.openModalReplaceMillesimeDatafile" />
    <jobs-card v-if="$store.state.mydatasets.jobs.openModalDetailJob" />
    <logs-modal v-if="$store.state.mydatasets.openModalShowLogs" />
    <div class="row justify-around">
      <div class="col-xs-12 cols-sm-12 col-md-8 col-lg-6 text-center">
        <q-btn color="secondary" big class="full-width" icon="mdi-folder-plus" @click="openModalCreateDataset" label="Ajouter un jeu de données" title="Ajouter un nouveau jeu de données" />
      </div>
    </div>
    <transition-group class="q-mt-md row gutter-sm" v-show="!loading" appear enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
      <div v-for="dataset in datasets" :key="dataset.id" :id="'id-' + dataset.id" class="col-xs-12 cols-sm-12 col-md-6 col-lg-4 text-center">
        <datasets-row :dataset="dataset" />
      </div>
    </transition-group>
    <q-inner-loading :visible="loading">
      <q-spinner-gears :size="50" color="secondary" />
      <br><br>
      <div class="text-secondary full-width text-center">Chargement de vos jeux de données. Merci de patienter...</div>
    </q-inner-loading>
  </q-page>
</template>

<script>
import DatasetsRow from 'components/Datasets/Row'
import DatasetsWrite from 'components/Datasets/Write'
import AttachmentsDetail from 'components/Attachments/Detail'
import AttachmentsAdd from 'components/Attachments/Add'
import AttachmentsEditMetadata from 'components/Attachments/EditMetadata'
import AttachmentsReplaceFile from 'components/Attachments/ReplaceFile'
import DatafilesDetail from 'components/Datafiles/Detail'
import DatafilesAdd from 'components/Datafiles/Add'
import DatafilesEditMetadata from 'components/Datafiles/EditMetadata'
import DatafilesReplaceMillesime from 'components/Datafiles/ReplaceMillesime'
import DatafilesAddMillesime from 'components/Datafiles/AddMillesime'
import JobsCard from 'components/Jobs/Card'
import LogsModal from 'components/Logs/Modal'

export default {
  name: 'my-org-datasets',
  components: { DatasetsRow, DatasetsWrite, AttachmentsDetail, AttachmentsEditMetadata, AttachmentsAdd, AttachmentsReplaceFile, DatafilesDetail, DatafilesAdd, DatafilesEditMetadata, DatafilesReplaceMillesime, DatafilesAddMillesime, JobsCard, LogsModal },
  data () {
    return {}
  },
  computed: {
    datasets () {
      return this.$store.state.mydatasets.list
    },
    loading () {
      return this.$store.state.mydatasets.pending_list
    }
  },
  mounted () {

  },
  async created () {
    await this.$store.dispatch('mydatasets/initialize')
    setTimeout(() => { if (this.$route.hash) location.href = this.$route.path + this.$route.hash }, 1)
  },
  methods: {
    scrollFix: function (hash) {
      location.href = this.$route.path + hash
    },
    openModalCreateDataset: function () {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalWritingDataset', usedDataset: null })
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
