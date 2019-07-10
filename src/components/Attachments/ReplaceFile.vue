<template>
  <q-modal v-model="opened" @show="onshow" @hide="onhide" :content-css="{minWidth: '95vw', minHeight: '95vh'}">
    <q-modal-layout class="modalLayout">
      <q-toolbar slot="header" color="secondary" class="text-bold">
        <q-toolbar-title class="row items-center">
          <q-icon class="on-left" name="mdi-pencil" />Remplacement de la pièce jointe d'un fichier descriptif
        </q-toolbar-title>
        <q-btn flat @click="opened = false"><q-icon name="mdi-close-outline" /></q-btn>
      </q-toolbar>
      <div class="contentModal q-pa-md" v-if="attachment && dataset" v-show="!pending">
        <div class="bg-secondary text-white text-small q-mb-xl q-pa-md">
          <div class="q-mb-sm"><span class="text-bold on-left">Jeu de données :</span>{{dataset.title}}</div>
          <div class="q-mb-sm"><span class="text-bold on-left">Fichier descriptif :</span>{{attachment.title}}</div>
          <div><span class="text-bold on-left">Url du fichier actuel :</span>{{attachment.url}}</div>
        </div>
        <q-field icon="mdi-menu-right" :error="$v.tokenFile.$error" error-label="Vous devez envoyer un fichier">
          <file-upload-api v-model="tokenFile" :formSuccess="formSuccess" :extension="extensions" label="Votre nouveau fichier" :isDatafile="false" />
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

export default {
  name: 'attachments-replace-file',
  mixins: [validationMixin],
  components: { FileUploadApi },
  data () {
    return {
      formSuccess: false,
      tokenFile: null,
      extensions: this.$env('extensions')
    }
  },
  computed: {
    opened: {
      get () {
        return this.$store.state.mydatasets.openModalReplaceAttachment
      },
      set (value) {
        this.$store.commit('mydatasets/updateOpenModal', { open: value, modal: 'openModalReplaceAttachment' })
      }
    },
    dataset () {
      return this.$store.state.mydatasets.usedAttachment ? this.$store.state.mydatasets.usedAttachment.dataset : null
    },
    attachment () {
      return this.$store.state.mydatasets.usedAttachment ? this.$store.state.mydatasets.usedAttachment.attachment : null
    },
    pending () {
      return this.attachment ? this.attachment.pending_update : false
    },
    formAttachment () { return { tokenFile: this.tokenFile } }
  },
  created () {},
  validations: {
    tokenFile: {
      required
    }
  },
  methods: {
    onshow () {
      this.formSuccess = false
      console.log('open')
    },
    onhide () {
      console.log('close')
      this.tokenFile = null
      this.$v.$reset()
    },
    async submit () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      let result = await this.$store.dispatch('mydatasets/replaceAttachment', this.formAttachment)
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
