<template>
  <q-modal v-model="opened" @show="onshow" @hide="onhide" :content-css="{minWidth: '95vw', minHeight: '95vh'}" no-backdrop-dismiss no-esc-dismiss>
    <q-modal-layout class="modalLayout">
      <q-toolbar slot="header" color="secondary" class="text-bold">
        <q-toolbar-title class="row items-center">
          <q-icon class="on-left" name="mdi-pencil" />{{dataset ? 'Édition d\'un jeu de données' : 'Ajout d\'un jeu de données'}}
        </q-toolbar-title>
        <q-btn flat @click="opened = false"><q-icon name="mdi-close-outline" /></q-btn>
      </q-toolbar>
      <div class="contentModal q-pa-md" v-show="!pending">
        <q-stepper ref="stepper" v-model="currentStep" color="secondary" class="no-shadow" alternative-labels contractable>
          <q-step name='general' title='Généralité' :error="$v.generalGroup.$error">
            <q-field icon="mdi-menu-right" :error="$v.title.$error" error-label="Le champ est requis">
              <q-input color="secondary" v-model="title" stack-label="Le titre de votre jeu de données" @blur="$v.title.$touch" />
            </q-field>
            <br>
            <q-field icon="mdi-menu-right" :error="$v.organization.$error" error-label="Le champ est requis">
              <q-select v-if="organizations.length > 1" color="secondary" v-model="organization" stack-label="Organisation publiant le jeu de données" :options="organizations" @blur="$v.organization.$touch" />
              <q-input v-else readonly color="secondary" :value="organizationName" stack-label="Organisation publiant le jeu de données" class="mydisabled-q-input" />
            </q-field>
            <br>
            <q-field icon="mdi-menu-right" :error="$v.description.$error" error-label="Le champ est requis">
              <q-input color="secondary" v-model="description" stack-label="Description de votre jeu de données" type="textarea" :rows="5" @blur="$v.description.$touch" />
            </q-field>
            <br>
            <q-field icon="mdi-menu-right" :error="$v.frequency.$error" error-label="Le champ est requis">
              <q-select color="secondary" v-model="frequency" stack-label="Fréquence de mise-à-jour du jeu de données" :options="frequencies" @blur="$v.frequency.$touch" />
            </q-field>
            <br>
            <q-field icon="mdi-menu-right" :error="$v.frequency_date.$error" error-label="Le champ est requis et doit être une date valide">
              <q-datetime color="secondary" v-model="frequency_date" stack-label="Prochaine date de mise-à-jour du jeu de données" type="date" clearable monday-first format="DD MMMM YYYY" @input="$v.frequency_date.$touch" />
            </q-field>
          </q-step>
          <q-step name='topic' title='Thème et mots-clé' :error="$v.topicGroup.$error">
            <q-field icon="mdi-menu-right" :error="$v.topic.$error" error-label="Le champ est requis">
              <q-select color="secondary" v-model="topic" stack-label="Thème du jeu de données" :options="topics" @blur="$v.topic.$touch" />
            </q-field>
            <br>
            <q-field icon="mdi-menu-right" :error="$v.tags.$error" error-label="Vous devez saisir des mots-clé valides">
              <div class="row">
                <q-input color="secondary" v-model="inputTag" placeholder="Ajouter un mot-clé" stack-label="Les mots-clé de votre jeu de données" class="col-xs-12 col-sm-8 col-md-6 col-lg-4 on-left">
                  <q-autocomplete :max-results="10" :static-data="{ field: 'value', list: tagsList }" @selected="selectTag" :filter="filterTags" />
                </q-input>
                <q-chip v-for="(tag, i) in tags" :key="i" :color="$v.tags.$each[i].$error ? 'negative' : 'secondary'" icon="mdi-tag" detail small square closable class="mytag col-auto self-end on-left" @hide="removeTag(i)">
                  <span class="text-small">{{displayTag(tag)}}</span>
                </q-chip>
              </div>
            </q-field>
            <br>
            <q-field icon="mdi-menu-right" :error="$v.license.$error" error-label="Le champ est requis">
              <q-select color="secondary" v-model="license" stack-label="Licence de publication du jeu de données" :options="licenses" @blur="$v.license.$touch" />
            </q-field>
          </q-step>
          <q-step name='more' title='Plus...' :error="$v.moreGroup.$error">
            <q-field icon="mdi-menu-right" :error="$v.granularity.$error" error-label="Veuillez choisir uen granularité parmi les valeurs proposées">
              <q-select color="secondary" v-model="granularity" stack-label="Granularité spatiale du jeu de données" :options="granularities" clearable @blur="$v.granularity.$touch" />
            </q-field>
            <br>
            <q-field icon="mdi-menu-right" :error="$v.zones.$error" error-label="Vous devez saisir des zones valides">
              <div class="row">
                <q-input color="secondary" v-model="inputZone" placeholder="Ajouter une zone" stack-label="La couverture spatiale de votre jeu de données" class="col-xs-12 col-sm-8 col-md-6 col-lg-4 on-left">
                  <q-autocomplete :max-results="10" @search="searchZones" @selected="selectZone" />
                </q-input>
                <q-chip v-for="(zone, i) in zones" :key="i" :color="$v.zones.$each[i].$error ? 'negative' : 'secondary'" icon="mdi-map-marker-radius" detail small square closable class="mytag col-auto self-end on-left" @hide="removeZone(i)">
                  <span class="text-small" :title="zone.value">{{zone.label}} ({{zone.sublabel}})</span>
                </q-chip>
              </div>
            </q-field>
            <br>
            <q-field icon="mdi-menu-right" :error="$v.startDate.$error || $v.endDate.$error" error-label="Vous devez remplir les deux dates, la date de fin devant être supérieure à la date de début.">
              <div class="row q-if-label labelTemporalCoverage">Couverture temporelle du jeu de données</div>
              <div class="row">
                <q-datetime color="secondary" v-model="startDate" placeholder="Début" type="date" clearable monday-first format="DD MMMM YYYY" @blur="$v.startDate.$touch" class="col-6" />
                <q-datetime color="secondary" v-model="endDate" placeholder="Fin" type="date" clearable monday-first format="DD MMMM YYYY" @blur="$v.endDate.$touch" class="col-6" />
              </div>
            </q-field>
            <br>
            <q-field icon="mdi-menu-right">
              <q-input color="secondary" v-model="caution" stack-label="Vous pouvez ajouter des précautions d'usage" type="textarea" :rows="5" />
            </q-field>
          </q-step>
        </q-stepper>
        <div class="row reverse justify-center actions">
          <q-btn v-show="currentStep !== 'more'" outline color="secondary" @click="nextStep" small>Suivant<q-icon name="mdi-chevron-double-right" class="on-right" /></q-btn>
          <q-btn v-if="currentStep === 'more'" outline color="primary" @click="submit" small><q-icon name="mdi-content-save" class="on-left" />Enregistrer</q-btn>
          <q-btn v-show="currentStep !== 'general'" outline color="secondary" @click="$refs.stepper.previous()" small class="on-left"><q-icon name="mdi-chevron-double-left" class="on-left" />Précédent</q-btn>
        </div>
      </div>
      <q-inner-loading :visible="pending">
        <q-spinner-gears :size="50" color="secondary" />
        <br><br>
        <div class="text-secondary full-width text-center">Nous envoyons vos informations. Merci de patienter...</div>
      </q-inner-loading>
    </q-modal-layout>
  </q-modal>
</template>

<script>
import { date } from 'quasar'
import { validationMixin } from 'vuelidate'
import { required, requiredIf } from 'vuelidate/lib/validators'
import nomenclatures from '../../nomenclatures'
import api from '../../api'

export default {
  name: 'datasets-write',
  mixins: [validationMixin],
  data () {
    return {
      currentStep: 'general',
      organizations: this.$store.getters['auth/user'].organizations.map(({ id, title, acronym }) => ({ value: id, label: acronym, sublabel: title })),
      frequencies: [],
      topics: [],
      licenses: [],
      tagsList: [],
      granularities: [],
      title: '',
      organization: '',
      description: '',
      frequency: '',
      frequency_date: '',
      topic: '',
      inputTag: '',
      tags: [],
      license: '',
      granularity: '',
      inputZone: '',
      zones: [],
      startDate: '',
      endDate: '',
      caution: ''
    }
  },
  computed: {
    opened: {
      get () {
        return this.$store.state.mydatasets.openModalWritingDataset
      },
      set (value) {
        this.$store.commit('mydatasets/updateOpenModal', { open: value, modal: 'openModalWritingDataset' })
      }
    },
    dataset () {
      return this.$store.state.mydatasets.usedDataset
    },
    pending () {
      return this.dataset ? this.dataset.pending_update : this.$store.state.mydatasets.pending_add
    },
    organizationName () {
      let organization = this.organizations.find(o => o.value === this.organization)
      return organization ? organization.label : ''
    },
    formDataset () {
      let formDataset = {
        title: this.title,
        organization: this.organization,
        description: this.description,
        frequency: this.frequency,
        topic: this.topic,
        tags: this.tags,
        license: this.license
      }
      if (this.frequency_date) formDataset.frequency_date = this.frequency_date
      formDataset.spatial = {}
      if (this.granularity) formDataset.spatial.granularity = this.granularity
      formDataset.spatial.zones = this.zones.length ? this.zones.map(zone => zone.value) : []
      if (this.startDate && this.endDate) {
        formDataset.temporal_coverage = {
          start: this.startDate,
          end: this.endDate
        }
      }
      if (this.caution) formDataset.caution = this.caution
      return formDataset
    }
  },
  watch: {
    frequency (val) {
      if (!this.frequency_date) {
        if (val === 'daily') this.frequency_date = date.addToDate(new Date(), { days: 1 })
        if (val === 'weekly') this.frequency_date = date.addToDate(new Date(), { days: 7 })
        if (val === 'monthly') this.frequency_date = date.addToDate(new Date(), { month: 1 })
        if (val === 'quarterly') this.frequency_date = date.addToDate(new Date(), { month: 3 })
        if (val === 'semiannual') this.frequency_date = date.addToDate(new Date(), { month: 6 })
        if (val === 'annual') this.frequency_date = date.addToDate(new Date(), { year: 1 })
      }
    }
  },
  created () {},
  validations: {
    title: {
      required
    },
    organization: {
      required,
      in (value) {
        if (value) return this.organizations.find(organization => organization.value === value)
        return true
      }
    },
    description: {
      required
    },
    frequency: {
      required,
      in (value) {
        if (value) return this.frequencies.find(frequency => frequency.value === value)
        return true
      }
    },
    frequency_date: {
      requiredIf: requiredIf(function () {
        return this.frequency && (this.frequency !== 'unknown')
      }),
      isDate (value) {
        if (new Date(value) instanceof Date) return true
        return false
      }
    },
    topic: {
      required,
      in (value) {
        if (value) return this.topics.find(topic => topic.value === value)
        return true
      }
    },
    license: {
      required,
      in (value) {
        if (value) return this.licenses.find(license => license.value === value)
        return true
      }
    },
    tags: {
      $each: {
        in (value) {
          if (value) return this.tagsList.find(tag => tag.value === value) !== undefined
          return true
        }
      }
    },
    granularity: {
      in (value) {
        if (value) return this.granularities.find(granularity => granularity.value === value)
        return true
      }
    },
    zones: {
      $each: {
        in: async (zone) => {
          let result = await api.getzone(zone.value)
          if (result instanceof Error) return false
          return result
        }
      }
    },
    startDate: {
      requiredIf: requiredIf(function () {
        return (this.endDate !== '') && (this.endDate !== null)
      }),
      isDate (value) {
        if ((value === '') || (value === null)) return true
        if (new Date(value) instanceof Date) return true
        return false
      }
    },
    endDate: {
      requiredIf: requiredIf(function () {
        return (this.startDate !== '') && (this.startDate !== null)
      }),
      isDate (value) {
        if ((value === '') || (value === null)) return true
        if (new Date(value) instanceof Date) return true
        return false
      },
      greatherThan (value) {
        if ((this.startDate === '') || (this.startDate === null)) return true
        return new Date(value) > new Date(this.startDate)
      }
    },
    generalGroup: ['title', 'description', 'organization', 'frequency', 'frequency_date'],
    topicGroup: ['topic', 'license', 'tags'],
    moreGroup: ['granularity', 'zones', 'startDate', 'endDate']
  },
  methods: {
    async onshow () {
      console.log('onshow')
      this.granularities = (await nomenclatures.granularities()).map(granularity => ({ label: granularity.label, value: granularity.id }))
      this.frequencies = (await nomenclatures.frequencies()).map(frequency => ({ label: frequency.label, value: frequency.id }))
      this.licenses = (await nomenclatures.licenses()).map(license => ({ label: license.name, sublabel: license.description, value: license.id }))
      this.topics = (await nomenclatures.topics()).map(topic => ({ label: topic, value: topic }))
      this.tagsList = (await nomenclatures.tags()).map(tag => ({ value: tag.value, label: tag.display }))
      if (this.dataset) {
        this.title = this.dataset.title
        this.organization = this.dataset.organization.id
        this.description = this.dataset.description
        this.frequency = this.dataset.frequency
        this.frequency_date = this.dataset.frequency_date
        this.topic = this.dataset.topic
        this.tags = this.dataset.tags.slice()
        this.license = this.dataset.license
        if (this.dataset.spatial) this.granularity = this.dataset.spatial.granularity
        if (this.dataset.spatial && this.dataset.spatial.zones) {
          let zones = this.dataset.spatial.zones.slice()
          this.zones = await Promise.all(zones.map(async (zone) => {
            let zoneFull = await api.getzone(zone)
            if (!(zoneFull instanceof Error)) return {value: zoneFull.id, label: zoneFull.name, sublabel: nomenclatures.levels[zoneFull.level] + ' - ' + zoneFull.code}
          }))
        }
        if (this.dataset.temporal_coverage) {
          this.startDate = this.dataset.temporal_coverage.start
          this.endDate = this.dataset.temporal_coverage.end
        }
        this.caution = this.dataset.caution
      }
      if (this.organizations.length === 1) this.organization = this.organizations[0].value
    },
    onhide () {
      console.log('onhide')
      this.currentStep = 'general'
      this.title = ''
      this.organization = ''
      this.description = ''
      this.frequency = ''
      this.frequency_date = ''
      this.topic = ''
      this.inputTag = ''
      this.tags = []
      this.license = ''
      this.granularity = ''
      this.inputZone = ''
      this.zones = []
      this.startDate = ''
      this.endDate = ''
      this.caution = ''
      this.$v.$reset()
    },
    filterTags (term, { field, list }) {
      term = term.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      term = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      let regex = new RegExp(term, 'i')
      return list.filter(item => {
        if (regex.test(item.label.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) return true
        if (regex.test(item.value)) return true
        return false
      })
    },
    selectTag (selectedTag) {
      if (!this.tags.find(tag => tag === selectedTag.value)) {
        this.tags.push(selectedTag.value)
      }
      this.inputTag = ''
    },
    removeTag (indexTag) {
      this.tags.splice(indexTag, 1)
    },
    displayTag (tagValue) {
      return this.tagsList.find(tag => tag.value === tagValue).label
    },
    async searchZones (term, done) {
      let zones = await api.getsuggestzones(term)
      if (!zones) {
        zones = []
      } else {
        zones = zones.map(zone => {
          return {value: zone.id, label: zone.name, sublabel: nomenclatures.levels[zone.level] + ' - ' + zone.code}
        })
      }
      done(zones)
    },
    selectZone (selectedZone) {
      if (!this.zones.find(zone => zone.value === selectedZone.value)) {
        this.zones.push(selectedZone)
      }
      this.inputZone = ''
    },
    removeZone (indexZone) {
      this.zones.splice(indexZone, 1)
    },
    nextStep () {
      if (this.currentStep === 'general') {
        if (this.$v.generalGroup.$invalid) {
          this.$v.generalGroup.$touch()
          return
        }
      }
      if (this.currentStep === 'topic') {
        if (this.$v.topicGroup.$invalid) {
          this.$v.topicGroup.$touch()
          return
        }
      }
      this.$refs.stepper.next()
    },
    async submit () {
      let isValid = await this.isValid()
      if (!isValid) {
        return
      }
      let result
      if (!this.dataset) {
        result = await this.$store.dispatch('mydatasets/addDataset', this.formDataset)
      } else {
        result = await this.$store.dispatch('mydatasets/updateDataset', this.formDataset)
      }
      this.opened = !result
    },
    _finishValidations () {
      return new Promise(resolve => {
        if (this.$v.$error || !this.$v.$pending) {
          return resolve()
        }
        let poll = setInterval(() => {
          if (!this.$v.$pending) {
            clearInterval(poll)
            resolve()
          }
        }, 200)
      })
    },
    async isValid () {
      this.$v.$reset()
      this.$v.$touch()
      await this._finishValidations()
      return !this.$v.$error
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~quasar-styl'
.modalLayout /deep/ .q-layout-header
  @extend .no-shadow
.contentModal /deep/ .q-if-label
  @extend .text-bold
.contentModal /deep/ .q-input-target
  @extend .q-caption, .text-secondary, .q-mt-xs
.actions .q-btn
  min-width 150px
/deep/ .mytag
  &.q-chip-small
    @extend .q-mt-sm
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
.labelTemporalCoverage
  font-size 0.75rem
.mydisabled-q-input /deep/ .q-input-target
  @extend .disabled
</style>
