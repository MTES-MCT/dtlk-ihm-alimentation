<template>
  <q-modal v-model="opened" @show="onshow" @hide="onhide" :content-css="{minWidth: '95vw', minHeight: '95vh'}">
    <q-modal-layout class="modalLayout">
      <q-toolbar slot="header" color="secondary" class="text-bold">
        <q-toolbar-title class="row items-center">
          <q-icon class="on-left" name="mdi-pencil" />Édition des métadonnées d'un fichier de données
        </q-toolbar-title>
        <q-btn flat @click="opened = false"><q-icon name="mdi-close-outline" /></q-btn>
      </q-toolbar>
      <div class="contentModal q-pa-md" v-if="datafile && dataset" v-show="!pending">
        <div class="bg-secondary text-white text-small q-mb-xl q-pa-md">
          <div class="q-mb-sm"><span class="text-bold on-left">Jeu de données :</span>{{dataset.title}}</div>
          <div><span class="text-bold on-left">Fichier de données :</span>{{datafile.title}}</div>
        </div>
        <q-field icon="mdi-menu-right" :error="$v.title.$error" error-label="Le champ est requis">
          <q-input color="secondary" v-model="title" stack-label="Le titre de votre fichier de données" @blur="$v.title.$touch" />
        </q-field>
        <br>
        <q-field icon="mdi-menu-right" :error="$v.description.$error" error-label="Le champ est requis">
          <q-input color="secondary" v-model="description" stack-label="Description de votre fichier" type="textarea" :row="5" @blur="$v.description.$touch" />
        </q-field>
        <br>
        <q-field icon="mdi-menu-right" :error="$v.published.$error" error-label="Le champ est requis et doit être une date valide">
          <q-datetime color="secondary" v-model="published" stack-label="Date de publication du fichier" type="date" monday-first format="DD MMMM YYYY" @input="$v.published.$touch" />
        </q-field>
        <br>
        <q-field icon="mdi-menu-right" :error="$v.temporal_coverage_start.$error || $v.temporal_coverage_end.$error" error-label="Vous devez remplir les deux dates, la date de fin devant être supérieure à la date de début.">
          <div class="row q-if-label labelTemporalCoverage">Couverture temporelle du fichier de données</div>
          <div class="row">
            <q-datetime color="secondary" v-model="temporal_coverage_start" placeholder="Début" type="date" clearable monday-first format="DD MMMM YYYY" @blur="$v.temporal_coverage_start.$touch" class="col-6" />
            <q-datetime color="secondary" v-model="temporal_coverage_end" placeholder="Fin" type="date" clearable monday-first format="DD MMMM YYYY" @blur="$v.temporal_coverage_end.$touch" class="col-6" />
          </div>
        </q-field>
        <br>
        <q-field icon="mdi-menu-right">
          <q-input color="secondary" v-model="legal_notice" stack-label="Source à mentionner" type="textarea" :rows="3" />
        </q-field>
        <div class="row justify-end q-mt-lg">
          <q-btn small outline @click="submit" color="secondary" :disabled="$v.$error"><q-icon name="mdi-content-save" class="on-left" />Enregistrer</q-btn>
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
import { validationMixin } from 'vuelidate'
import { required, requiredIf } from 'vuelidate/lib/validators'

export default {
  name: 'datafiles-edit-metadata',
  mixins: [validationMixin],
  data () {
    return {
      title: '',
      description: '',
      published: '',
      temporal_coverage_start: '',
      temporal_coverage_end: '',
      legal_notice: ''
    }
  },
  computed: {
    opened: {
      get () {
        return this.$store.state.mydatasets.openModalEditDatafile
      },
      set (value) {
        this.$store.commit('mydatasets/updateOpenModal', { open: value, modal: 'openModalEditDatafile' })
      }
    },
    dataset () {
      return this.$store.state.mydatasets.usedDatafile ? this.$store.state.mydatasets.usedDatafile.dataset : null
    },
    datafile () {
      return this.$store.state.mydatasets.usedDatafile ? this.$store.state.mydatasets.usedDatafile.datafile : null
    },
    pending () {
      return this.datafile ? this.datafile.pending_update : false
    },
    formDatafile () {
      let formDatafile = {
        title: this.title,
        description: this.description,
        published: this.published
      }
      if (this.temporal_coverage_start) formDatafile.temporal_coverage_start = this.temporal_coverage_start
      if (this.temporal_coverage_end) formDatafile.temporal_coverage_end = this.temporal_coverage_end
      if (this.legal_notice) formDatafile.legal_notice = this.legal_notice
      return formDatafile
    }
  },
  created () {},
  validations: {
    title: {
      required
    },
    description: {
      required
    },
    published: {
      required,
      isDate (value) {
        if (new Date(value) instanceof Date) return true
        return false
      }
    },
    temporal_coverage_start: {
      requiredIf: requiredIf(function () {
        return (this.temporal_coverage_end !== '') && (this.temporal_coverage_end !== null)
      }),
      isDate (value) {
        if ((value === '') || (value === null)) return true
        if (new Date(value) instanceof Date) return true
        return false
      }
    },
    temporal_coverage_end: {
      requiredIf: requiredIf(function () {
        return (this.temporal_coverage_start !== '') && (this.temporal_coverage_start !== null)
      }),
      isDate (value) {
        if ((value === '') || (value === null)) return true
        if (new Date(value) instanceof Date) return true
        return false
      },
      greatherThan (value) {
        if ((this.temporal_coverage_start === '') || (this.temporal_coverage_start === null)) return true
        return new Date(value) > new Date(this.temporal_coverage_start)
      }
    }
  },
  methods: {
    onshow () {
      console.log('open')
      this.title = this.datafile.title
      this.description = this.datafile.description
      this.published = this.datafile.published
      if (this.datafile.temporal_coverage) {
        this.temporal_coverage_start = this.datafile.temporal_coverage.start
        this.temporal_coverage_end = this.datafile.temporal_coverage.end
      }
      this.legal_notice = this.datafile.legal_notice
    },
    onhide () {
      console.log('close')
      this.title = ''
      this.description = ''
      this.published = ''
      this.temporal_coverage_start = ''
      this.temporal_coverage_end = ''
      this.legal_notice = ''
      this.$v.$reset()
    },
    async submit () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      let result = await this.$store.dispatch('mydatasets/updateDatafile', this.formDatafile)
      this.opened = !result
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
.labelTemporalCoverage
  font-size 0.75rem
</style>
