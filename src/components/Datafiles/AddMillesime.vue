<template>
  <q-modal v-model="opened" @show="onshow" @hide="onhide" :content-css="{minWidth: '95vw', minHeight: '95vh'}">
    <q-modal-layout class="modalLayout">
      <q-toolbar slot="header" color="secondary" class="text-bold">
        <q-toolbar-title class="row items-center">
          <q-icon class="on-left" name="mdi-pencil" />Ajout d'un nouveau millesime d'un fichier de données
        </q-toolbar-title>
        <q-btn flat @click="opened = false"><q-icon name="mdi-close-outline" /></q-btn>
      </q-toolbar>
      <div class="contentModal q-pa-md" v-if="datafile && dataset" v-show="!pending">
        <div class="bg-secondary text-white text-small q-mb-xl q-pa-md">
          <div class="q-mb-sm"><span class="text-bold on-left">Jeu de données :</span>{{dataset.title}}</div>
          <div class="q-mb-sm"><span class="text-bold on-left">Fichier de données :</span>{{datafile.title}}</div>
        </div>
        <br>
        <q-field icon="mdi-menu-right">
          <div class="labelCalendrier">Millésime du fichier</div>
          <vue-monthly-picker selectedBackgroundColor="#cf641c" v-model="millesime" alignment= "center" dateFormat="YYYY-MM"></vue-monthly-picker>
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
import { required } from 'vuelidate/lib/validators'
import FileUploadApi from 'components/FormElements/FileUploadApi'
import moment from 'moment-timezone'
import VueMonthlyPicker from 'vue-monthly-picker'
export default {
  name: 'datafiles-add-millesime',
  mixins: [validationMixin],
  components: { FileUploadApi, VueMonthlyPicker },
  data () {
    return {
      tokenFile: null,
      millesime: moment(new Date()).format('YYYY-MM'),
      formSuccess: false
    }
  },
  watch: {
    millesime () {
      this.millesime = moment(this.millesime).format('YYYY-MM')
    }
  },
  computed: {
    opened: {
      get () {
        return this.$store.state.mydatasets.openModalAddMillesimeDatafile
      },
      set (value) {
        this.$store.commit('mydatasets/updateOpenModal', { open: value, modal: 'openModalAddMillesimeDatafile' })
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
      let data = {
        tokenFile: this.tokenFile,
        millesime: moment(this.millesime).format('YYYY-MM')
      }
      return data
    }
  },
  created () {},
  validations: {
    tokenFile: {
      required
    },
    millesime: {
      required
    }
  },
  methods: {
    onshow () {
      console.log('open')
    },
    onhide () {
      console.log('close')
      this.tokenFile = null
      this.millesime = moment(new Date()).format('YYYY-MM')
      this.$v.$reset()
    },
    async submit () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      let result = await this.$store.dispatch('mydatasets/addDatafileMillesime', this.formDatafile)
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
