<template>
  <q-card class="bg-white text-black full-width" :class="{'animated infinite mypulse': dataset.notify_update}">
    <q-item class="bg-warning text-white" v-if="dataset.pending_delete">
      <q-item-side color="white">
        <q-spinner-hourglass />
      </q-item-side>
      <q-item-main>
        <q-item-tile class="text-bold" label>Suppression du jeu de données en cours</q-item-tile>
      </q-item-main>
    </q-item>
    <q-item class="bg-secondary text-white" v-if="!dataset.pending_delete">
      <q-item-side icon="mdi-folder" color="white" />
      <q-item-main>
        <q-item-tile class="text-bold" label>{{dataset.title}}</q-item-tile>
      </q-item-main>
      <q-item-side right icon="mdi-menu" color="white">
        <q-popover ref="popover">
          <q-list link dense class="no-border datasetActions">
            <q-item dense class="q-caption" @click.native="[$refs.popover.hide(), openEditDataset()]">
              <q-item-side icon="mdi-pencil" />
              <q-item-main>
                <q-item-tile label>Éditer</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item-separator />
            <q-item dense class="q-caption" @click.native="[$refs.popover.hide(), openAddDatafile()]">
              <q-item-side icon="mdi-chart-bar" />
              <q-item-main>
                <q-item-tile label>Ajouter un fichier de données</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item dense class="q-caption" @click.native="[$refs.popover.hide(), openAddAttachment()]">
              <q-item-side icon="mdi-attachment" />
              <q-item-main>
                <q-item-tile label>Ajouter un fichier descriptif</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item-separator />
            <q-item dense class="q-caption" @click.native="[$refs.popover.hide(), confirmDeletion()]">
              <q-item-side color="negative" icon="mdi-delete" />
              <q-item-main>
                <q-item-tile color="negative" label>Supprimer</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item-separator />
            <q-item dense class="q-caption" @click.native="[$refs.popover.hide(), showLogs()]">
              <q-item-side color="primary" icon="mdi-history" />
              <q-item-main>
                <q-item-tile color="primary" label>Voir les logs</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-popover>
      </q-item-side>
    </q-item>
    <q-card-separator />
    <q-item>
      <q-item-side icon="mdi-numeric" />
      <q-item-main>
        <q-item-tile sublabel>{{dataset.id}}</q-item-tile>
      </q-item-main>
    </q-item>
    <q-card-separator />
    <q-item>
      <q-item-side icon="mdi-account-multiple" />
      <q-item-main>
        <q-item-tile sublabel>{{dataset.organization.title}}</q-item-tile>
      </q-item-main>
    </q-item>
    <template v-if="dataset.description">
      <q-card-separator />
      <q-item>
        <q-item-side icon="mdi-tooltip-text" />
        <q-item-main>
          <q-item-tile color="faded" sublabel><truncate class="descriptionText" :length="150" linkClass="truncateAction" :text="dataset.description" /></q-item-tile>
        </q-item-main>
      </q-item>
    </template>
    <q-card-separator />
    <q-collapsible icon="description" label="Métadonnées">
      <q-list dense no-border class="no-padding">
        <q-item class="q-caption">
          <q-item-main>
            <q-item-tile label class="text-bold">Thème</q-item-tile>
            <q-item-tile sublabel class="on-right">{{topic}}</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item v-if="dataset.tags.length" class="q-caption">
          <q-item-main>
            <q-item-tile label class="text-bold">Mots-clés</q-item-tile>
            <q-item-tile sublabel class="on-right">
              <q-chip v-for="(tag, i) in tags" :key="i" color="secondary" icon="mdi-tag" detail small square class="mytag q-mb-xs q-mr-xs">
                {{tag}}
              </q-chip>
            </q-item-tile>
          </q-item-main>
        </q-item>
        <q-item v-if="dataset.license" class="q-caption">
          <q-item-main>
            <q-item-tile label class="text-bold">Licence</q-item-tile>
            <q-item-tile sublabel class="on-right">{{license}}</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item v-if="dataset.frequency" class="q-caption">
          <q-item-main>
            <q-item-tile label class="text-bold">Fréquence de mise-à-jour</q-item-tile>
            <q-item-tile sublabel class="on-right">{{frequency}}</q-item-tile>
            <q-item-tile v-if="dataset.frequency_date" sublabel class="on-right text-italic">Prochaine mise-à-jour prévue le <span class="text-primary">{{frequencyDate}}</span></q-item-tile>
          </q-item-main>
        </q-item>
        <q-item v-if="dataset.spatial && dataset.spatial.granularity" class="q-caption">
          <q-item-main>
            <q-item-tile label class="text-bold">Granularité spatiale du jeu de données</q-item-tile>
            <q-item-tile sublabel class="on-right">{{granularity || '&lt;non remplie&gt;'}}</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item v-if="dataset.spatial && dataset.spatial.zones && dataset.spatial.zones.length" class="q-caption">
          <q-item-main>
            <q-item-tile label class="text-bold">Couverture spatiale</q-item-tile>
            <q-item-tile sublabel class="on-right">
              <q-chip v-for="(zone, i) in zonesWithName" :key="i" color="secondary" icon="mdi-map-marker-radius" detail small square class="mytag q-mb-xs q-ml-xs">
                {{zone}}
              </q-chip>
            </q-item-tile>
          </q-item-main>
        </q-item>
        <q-item v-if="dataset.temporal_coverage" class="q-caption">
          <q-item-main>
            <q-item-tile label class="text-bold">Couverture temporelle</q-item-tile>
            <q-item-tile sublabel class="on-right">Du <span class="text-primary">{{temporalCoverageStart}}</span> au <span class="text-primary">{{temporalCoverageEnd}}</span></q-item-tile>
          </q-item-main>
        </q-item>
        <q-item v-if="dataset.caution" class="q-caption">
          <q-item-main>
            <q-item-tile label class="text-bold">Précautions d'usage</q-item-tile>
            <q-item-tile sublabel class="on-right"><truncate class="descriptionText" :length="150" linkClass="truncateAction" :text="dataset.caution" /></q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>
    </q-collapsible>
    <q-card-separator />
    <q-collapsible icon="mdi-chart-bar" label="Fichiers de données" class="datafiles_list">
      <datafiles-list
        :datafiles="dataset.datafiles"
        :dataset="dataset"
      />
    </q-collapsible>
    <q-card-separator />
    <q-collapsible icon="mdi-attachment" label="Fichiers descriptifs" class="attachments_list">
      <attachments-list
        :attachments="dataset.attachments"
        :dataset="dataset"
      />
    </q-collapsible>
    <q-card-separator />
    <q-item class="text-small">
      <q-item-side icon="mdi-calendar-text" />
      <q-item-main>
        <q-item-tile v-if="dataset.created_at" sublabel>Créé le <span class="text-bold text-primary">{{createdDateDataset}}</span></q-item-tile>
        <q-item-tile v-if="lastDateDataset" sublabel>Mis-à-jour le <span class="text-bold text-primary">{{lastDateDataset}}</span></q-item-tile>
      </q-item-main>
    </q-item>
  </q-card>
</template>

<script>
import { date } from 'quasar'
import truncate from 'components/Commons/Truncate'
import api from '../../api'
import nomenclatures from '../../nomenclatures'
import DatafilesList from 'components/Datafiles/List'
import AttachmentsList from 'components/Attachments/List'

export default {
  name: 'datasets-row',
  components: {
    truncate, DatafilesList, AttachmentsList
  },
  props: ['dataset'],
  data () {
    return {
      zonesWithName: [],
      granularity: null,
      frequency: null,
      license: null,
      topic: null,
      tags: []
    }
  },
  computed: {
    frequencyDate () {
      return date.formatDate(new Date(this.dataset.frequency_date), 'DD MMMM YYYY')
    },
    temporalCoverageStart () {
      return date.formatDate(new Date(this.dataset.temporal_coverage.start), 'DD MMMM YYYY')
    },
    temporalCoverageEnd () {
      return date.formatDate(new Date(this.dataset.temporal_coverage.end), 'DD MMMM YYYY')
    },
    createdDateDataset () {
      return date.formatDate(new Date(this.dataset.created_at), 'DD MMMM YYYY')
    },
    lastDateDataset () {
      let lmDate = this.dataset.last_modified ? new Date(this.dataset.last_modified) : null
      let luDate = this.dataset.last_update ? new Date(this.dataset.last_update) : null
      if (lmDate && luDate) {
        let returnDate = lmDate > luDate ? lmDate : luDate
        return date.formatDate(returnDate, 'DD MMMM YYYY')
      }
      if (lmDate && !luDate) return date.formatDate(lmDate, 'DD MMMM YYYY')
      if (!lmDate && luDate) return date.formatDate(luDate, 'DD MMMM YYYY')
      return null
    }
  },
  created () {
    this.getZonesWithName()
    this.getGranularity()
    this.getFrequency()
    this.getLicense()
    this.getTopic()
    this.getTags()
  },
  watch: {
    'dataset.frequency': function (val) {
      this.getFrequency()
    },
    'dataset.topic': function (val) {
      this.getTopic()
    },
    'dataset.license': function (val) {
      this.getLicense()
    },
    'dataset.spatial.granularity': function (val) {
      this.getGranularity()
    },
    'dataset.spatial.zones': function (val) {
      this.getZonesWithName()
    },
    'dataset.tags': function (val) {
      this.getTags()
    }
  },
  methods: {
    openEditDataset () {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalWritingDataset', usedDataset: this.dataset })
    },
    openAddAttachment () {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalAddAttachment', usedAttachment: { dataset: this.dataset, attachment: null } })
    },
    openAddDatafile () {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalAddDatafile', usedDatafile: { dataset: this.dataset, datafile: null, millesime: null } })
    },
    async getGranularity () {
      let granularityDataset = this.dataset.spatial.granularity
      let granularities = await nomenclatures.granularities()
      this.granularity = granularities.find(granularity => granularity.id === granularityDataset).label
    },
    async getFrequency () {
      let frequencyDataset = this.dataset.frequency
      let frequencies = await nomenclatures.frequencies()
      this.frequency = frequencies.find(frequency => frequency.id === frequencyDataset).label
    },
    async getLicense () {
      let licenseDataset = this.dataset.license
      let licenses = await nomenclatures.licenses()
      this.license = licenses.find(license => license.id === licenseDataset).name
    },
    async getTopic () {
      let topicDataset = this.dataset.topic
      let topics = await nomenclatures.topics()
      this.topic = topics.find(topic => topic === topicDataset)
    },
    async getTags () {
      this.tags = []
      let tags = await nomenclatures.tags()
      for (let tagValue of this.dataset.tags) {
        this.tags.push(tags.find(tag => tag.value === tagValue).display)
      }
    },
    async getZonesWithName () {
      this.zonesWithName = []
      if (this.dataset.spatial && this.dataset.spatial.zones) {
        for (let zone of this.dataset.spatial.zones) {
          let zoneFull = await api.getzone(zone)
          if (zoneFull) this.zonesWithName.push(zoneFull.name + ' (' + nomenclatures.levels[zoneFull.level] + ' - ' + zoneFull.code + ')')
        }
      }
    },
    async confirmDeletion () {
      try {
        await this.$q.dialog({
          title: 'Demande de confirmation',
          color: 'secondary',
          message: 'Vous allez supprimer définitivement le jeu de données. Êtes-vous sûr ?',
          ok: 'Oui',
          cancel: 'Non, annuler !!'
        })
        await this.$store.dispatch('mydatasets/removeDataset', this.dataset)
      } catch (e) {}
    },
    showLogs () {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalShowLogs', usedObjectLog: { dataset: this.dataset } })
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~quasar-styl'
/deep/ .truncateAction
  @extend .cursor-pointer
  @extend .text-primary
  @extend .text-weight-bold
  @extend .on-right
/deep/ .mytag
  &.q-chip-small
    min-height 20px
    & .q-chip-main
      padding 2px 0
      @extend .q-caption
    & .q-chip-side
      height 20px
      width 20px
      min-width 20px
      & i
        @extend .q-caption
/deep/ .q-collapsible-sub-item
  @extend .q-py-none
.datasetActions /deep/ .q-item .q-icon
  @extend .q-subheading
.datasetActions /deep/ .q-item-side-left
  min-width unset
</style>
