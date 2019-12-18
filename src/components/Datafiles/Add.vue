<template>
  <q-modal v-model="opened" @show="onshow" @hide="onhide" :content-css="{minWidth: '95vw', minHeight: '95vh'}">
    <q-modal-layout class="modalLayout">
      <q-toolbar slot="header" color="secondary" class="text-bold">
        <q-toolbar-title class="row items-center">
          <q-icon class="on-left" name="mdi-pencil" />Ajout d'un fichier de données
        </q-toolbar-title>
        <q-btn flat @click="opened = false"><q-icon name="mdi-close-outline" /></q-btn>
      </q-toolbar>
      <div v-if="dataset" class="contentModal q-pa-md" v-show="!pending">
        <div class="bg-secondary text-white text-small q-mb-xl q-pa-md">
          <div><span class="text-bold on-left">Jeu de données :</span>{{dataset.title}}</div>
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
          <q-datetime color="secondary" v-model="published" stack-label="Date de publication du fichier" type="date" monday-first format="DD MMMM YYYY" @input="$v.description.$touch" />
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
        <br>
        <br>
        <q-field icon="mdi-menu-right">
          <div class="labelCalendrier">Millésime du fichier</div>
          <vue-monthly-picker selectedBackgroundColor="#cf641c" v-model="millesime" alignment= "center" dateFormat="YYYY-MM" @blur="$v.millesime.$touch"></vue-monthly-picker>
        </q-field>
        <br>
        <br>
        <q-field icon="mdi-menu-right" :error="$v.date_diffusion.$error || $v.heure_diffusion.$error" error-label="Vous devez remplir les deux champs, la date et l'heure de diffusion du fichier de données.">
          <div class="labelCalendrier"><q-checkbox v-model="CheckBox" color="faded" /> publier en différé</div>
          <div class="row" v-if="CheckBox == true">
            <q-datetime minimal color="secondary" v-model="date_diffusion" type="date" placeholder="Date de diffusion" format="DD MMMM YYYY" clearable  @blur="$v.date_diffusion.$touch" class="col-6"/>
            <q-datetime minimal color="secondary" v-model="heure_diffusion" type="time" placeholder="Heure de diffusion" clearable  @blur="$v.heure_diffusion.$touch" class="col-6"/>
          </div>
        </q-field>
        <br>
        <q-field icon="mdi-menu-right" :error="$v.tokenFile.$error" error-label="Vous devez envoyer un fichier">
          <file-upload-api v-model="tokenFile" :formSuccess="formSuccess" label="Fichier" extensions=".csv" :isDatafile="true" />
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
import FileUploadApi from 'components/FormElements/FileUploadApi'
import moment from 'moment-timezone'
import VueMonthlyPicker from 'vue-monthly-picker'

export default {
  name: 'datafiles-add',
  mixins: [validationMixin],
  components: { FileUploadApi, VueMonthlyPicker },
  data () {
    return {
      title: '',
      description: '',
      published: '',
      temporal_coverage_start: '',
      temporal_coverage_end: '',
      legal_notice: '',
      tokenFile: null,
      millesime: moment(new Date()).format('YYYY-MM'),
      formSuccess: false,
      date_diffusion: '',
      heure_diffusion: '',
      CheckBox: false
    }
  },
  computed: {
    opened: {
      get () {
        return this.$store.state.mydatasets.openModalAddDatafile
      },
      set (value) {
        this.$store.commit('mydatasets/updateOpenModal', { open: value, modal: 'openModalAddDatafile' })
      }
    },
    dataset () {
      return this.$store.state.mydatasets.usedDatafile ? this.$store.state.mydatasets.usedDatafile.dataset : null
    },
    pending () {
      return this.dataset ? this.dataset.pending_update : false
    },
    formDatafile () {
      let data = {
        title: this.title,
        description: this.description,
        published: this.published,
        tokenFile: this.tokenFile,
        millesime: moment(this.millesime).format('YYYY-MM')
      }
      if (this.date_diffusion !== '' && this.heure_diffusion !== '') {
        data.date_diffusion = moment(this.date_diffusion).format('YYYY-MM-DD')
        data.heure_diffusion = moment(this.heure_diffusion).format('HH:mm')
      }
      if (this.temporal_coverage_end && this.temporal_coverage_start) {
        data.temporal_coverage_end = this.temporal_coverage_end
        data.temporal_coverage_start = this.temporal_coverage_start
      }
      if (this.legal_notice) data.legal_notice = this.legal_notice
      return data
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
    },
    tokenFile: {
      required
    },
    millesime: {
      required
    },
    date_diffusion: {
      requiredIf: requiredIf(function () {
        return this.CheckBox
      })
    },
    heure_diffusion: {
      requiredIf: requiredIf(function () {
        return this.CheckBox
      })
    }
  },
  methods: {
    onshow () {
      console.log('open')
    },
    onhide () {
      console.log('close')
      this.title = ''
      this.description = ''
      this.published = ''
      this.temporal_coverage_start = ''
      this.temporal_coverage_end = ''
      this.legal_notice = ''
      this.tokenFile = null
      this.millesime = moment(new Date()).format('YYYY-MM')
      this.date_diffusion = ''
      this.heure_diffusion = ''
      this.$v.$reset()
    },
    async submit () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      let result = await this.$store.dispatch('mydatasets/addDatafile', this.formDatafile)
      this.formSuccess = result
      await this.$sleep(500)
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
<style lang="stylus">
  .month-year-display.input
    border-radius: 30px !important;
  .labelCalendrier
    font-size: 0.75rem;
    transform: translate(0, -100%);
    line-height: 9px;
    font-weight: bold;
    color: #979797;
</style>
