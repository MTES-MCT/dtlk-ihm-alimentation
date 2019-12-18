<template>
  <q-modal v-model="opened" @show="onshow" @hide="onhide" :content-css="{minWidth: '95vw', minHeight: '95vh'}">
    <q-modal-layout class="modalLayout">
      <q-toolbar slot="header" color="secondary" class="text-bold">
        <q-toolbar-title class="row items-center">
          <q-icon class="on-left" name="mdi-pencil" />Remplacement d'un fichier de données
        </q-toolbar-title>
        <q-btn flat @click="opened = false"><q-icon name="mdi-close-outline" /></q-btn>
      </q-toolbar>
      <div class="contentModal q-pa-md"  v-if="datafile && dataset && millesime" v-show="!pending">
        <div class="bg-secondary text-white text-small q-mb-xl q-pa-md">
          <div class="q-mb-sm"><span class="text-bold on-left">Jeu de données :</span>{{dataset.title}}</div>
          <div class="q-mb-sm"><span class="text-bold on-left">Fichier de données :</span>{{datafile.title}}</div>
          <div><span class="text-bold on-left">Millesime remplacé :</span>{{millesime}}</div>
        </div>
        <br>
        <q-field icon="mdi-menu-right" :error="$v.date_diffusion.$error || $v.heure_diffusion.$error" error-label="Vous devez remplir les deux champs, la date et l'heure de diffusion du fichier de données.">
          <div class="labelCalendrier"><q-checkbox v-model="CheckBox" color="faded" /> publier en différé</div>
          <div class="row" v-if="CheckBox == true">
            <q-datetime minimal color="secondary" v-model="date_diffusion" type="date" placeholder="Date de diffusion" format="DD MMMM YYYY" clearable  @blur="$v.date_diffusion.$touch" class="col-6" />
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

export default {
  name: 'datafiles-replace-millesime',
  mixins: [validationMixin],
  components: { FileUploadApi },
  data () {
    return {
      tokenFile: null,
      formSuccess: false,
      date_diffusion: '',
      heure_diffusion: '',
      CheckBox: false
    }
  },
  computed: {
    opened: {
      get () {
        return this.$store.state.mydatasets.openModalReplaceMillesimeDatafile
      },
      set (value) {
        this.$store.commit('mydatasets/updateOpenModal', { open: value, modal: 'openModalReplaceMillesimeDatafile' })
      }
    },
    dataset () {
      return this.$store.state.mydatasets.usedDatafile ? this.$store.state.mydatasets.usedDatafile.dataset : null
    },
    datafile () {
      return this.$store.state.mydatasets.usedDatafile ? this.$store.state.mydatasets.usedDatafile.datafile : null
    },
    millesime () {
      return this.$store.state.mydatasets.usedDatafile ? this.$store.state.mydatasets.usedDatafile.millesime : null
    },
    datePublication () {
      return this.$store.state.mydatasets.usedDatafile ? this.$store.state.mydatasets.usedDatafile.datePublication : null
    },
    pending () {
      return this.datafile ? this.datafile.pending_update : false
    },
    formDatafile () {
      let formDatafile = {
        tokenFile: this.tokenFile,
        millesime: this.millesime
      }
      if (this.CheckBox === true) {
        formDatafile.date_diffusion = moment(this.date_diffusion).format('YYYY-MM-DD')
        formDatafile.heure_diffusion = moment(this.heure_diffusion).format('HH:mm')
      }
      return formDatafile
    }
  },
  created () {},
  validations: {
    tokenFile: {
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
      if (this.datePublication.length !== 0) {
        this.date_diffusion = this.datePublication[0]
        this.heure_diffusion = this.datePublication[1]
        this.CheckBox = true
      }
    },
    onhide () {
      console.log('close')
      this.tokenFile = null
      this.date_diffusion = ''
      this.heure_diffusion = ''
      this.$v.$reset()
    },
    async submit () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      let result = await this.$store.dispatch('mydatasets/replaceDatafileMillesime', this.formDatafile)
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
</style>
