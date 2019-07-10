<template>
  <q-modal v-model="opened" @show="onshow" @hide="onhide" :content-css="{minWidth: '95vw', minHeight: '95vh'}">
    <q-modal-layout class="modalLayout">
      <q-toolbar slot="header" color="secondary" class="text-bold">
        <q-toolbar-title class="row items-center">
          <q-icon class="on-left" name="mdi-pencil" />Ajout d'un fichier descriptif
        </q-toolbar-title>
        <q-btn flat @click="opened = false"><q-icon name="mdi-close-outline" /></q-btn>
      </q-toolbar>
      <div v-if="dataset" class="contentModal q-pa-md" v-show="!pending">
        <div class="bg-secondary text-white text-small q-mb-xl q-pa-md">
          <div><span class="text-bold on-left">Jeu de données :</span>{{dataset.title}}</div>
        </div>
        <q-field icon="mdi-menu-right" :error="$v.title.$error" error-label="Le champ est requis">
          <q-input color="secondary" v-model="title" stack-label="Le titre de votre fichier descriptif" @blur="$v.title.$touch" />
        </q-field>
        <br>
        <q-field icon="mdi-menu-right" :error="$v.description.$error" error-label="Le champ est requis">
          <q-input color="secondary" v-model="description" stack-label="Description de votre fichier" type="textarea" :row="5" @blur="$v.description.$touch" />
        </q-field>
        <br>
        <q-field icon="mdi-menu-right" :error="$v.published.$error" error-label="Le champ est requis et doit être une date valide">
          <q-datetime color="secondary" v-model="published" stack-label="Date de publication du fichier" type="date" monday-first format="DD MMMM YYYY" @input="$v.description.$touch" />
        </q-field>
        <br><br>
        <q-field icon="mdi-menu-right" :error="$v.tokenFile.$error" error-label="Vous devez envoyer un fichier">
          <file-upload-api v-model="tokenFile" :formSuccess="formSuccess" :extensions="extensions" label="Fichier" :isDatafile="false" />
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
import { env } from 'plugins/env'

export default {
  name: 'attachments-add',
  mixins: [validationMixin],
  components: { FileUploadApi },
  data () {
    return {
      title: '',
      description: '',
      published: '',
      tokenFile: null,
      formSuccess: false,
      extensions: env('extensions')
    }
  },
  computed: {
    opened: {
      get () {
        return this.$store.state.mydatasets.openModalAddAttachment
      },
      set (value) {
        this.$store.commit('mydatasets/updateOpenModal', { open: value, modal: 'openModalAddAttachment' })
      }
    },
    dataset () {
      return this.$store.state.mydatasets.usedAttachment ? this.$store.state.mydatasets.usedAttachment.dataset : null
    },
    pending () {
      return this.dataset ? this.dataset.pending_update : false
    },
    formAttachment () {
      return {
        title: this.title,
        description: this.description,
        published: this.published,
        tokenFile: this.tokenFile
      }
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
    tokenFile: {
      required
    }
  },
  methods: {
    onshow () {
      console.log('onshow')
    },
    onhide () {
      console.log('onhide')
      this.title = ''
      this.description = ''
      this.published = ''
      this.tokenFile = null
      this.$v.$reset()
    },
    async submit () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      let result = await this.$store.dispatch('mydatasets/addAttachment', this.formAttachment)
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
