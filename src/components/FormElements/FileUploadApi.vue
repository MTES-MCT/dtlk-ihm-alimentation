<template>
  <div>
    <q-uploader ref="uploader" color="secondary" name="file" :stack-label="label"
      :url="apiOptions.url" :headers="headers" :extensions="extensions" :send-raw="true"
      no-thumbnails hide-upload-button hide-underline class="myuploadapi" :class="{ uploading: fileName !== null}" :multiple="false" clearable auto-expand
      @add="add"
      @uploaded="uploaded"
      @fail="fail"
      @remove:done="removedone" @remove:cancel="removebeforedone" @remove:abort="removebeforedone"
    />
    <div v-if="errorUploadmessage !== null" class="q-mt-md">
      <div class="text-negative text-bold row items-center"><q-icon name="mdi-alert" class="on-left" />{{errorUploadmessage}}</div>
    </div>
    <div v-if="checkAlert !== null" class="q-mt-md">
      <div class="text-negative text-bold row items-center"><q-icon name="mdi-alert" class="on-left" />{{checkAlert.message}}</div>
      <template v-for="(errors,column) in checkAlert.errors">
        <q-item v-for="(error,index) in errors" :key="index" class="q-caption" dense>
          <q-item-main>{{column.replace('_', ' ')}}: {{error.message}}</q-item-main>
        </q-item>
      </template>
    </div>
    <div v-if="checkOk" class="q-mt-md">
      <div class="text-green text-small text-bold row items-center">Votre fichier est valide</div>
    </div>
    <div v-if="pending_checkcsv" class="q-mt-md">
      <div class="text-blue text-small text-bold row items-center"><q-spinner-hourglass :size="16" class="on-left"/>Votre fichier a été transféré. Un contrôle de conformité est en train d'être réalisé.</div>
    </div>
  </div>
</template>

<script>
import api from '../../api'

export default {
  name: 'file-upload-api',
  props: ['value', 'formSuccess', 'label', 'extensions', 'isDatafile'],
  data () {
    return {
      apiOptions: api.uploadFileOptions,
      tokenFile: this.value,
      fileName: null,
      checkAlert: null,
      checkOk: false,
      errorUploadmessage: null,
      pending_checkcsv: false
    }
  },
  computed: {
    headers () {
      return api.uploadFileOptions.headersPost(this.$store.getters['auth/apiKey'], this.fileName)
    }
  },
  watch: {
    async tokenFile (val) {
      this.$emit('input', val)
      if (val && this.isDatafile) {
        this.pending_checkcsv = true
        let check = await api.checkcsvfile(this.$store.getters['auth/apiKey'], this.tokenFile)
        this.pending_checkcsv = false
        if (check.result === 'valid') {
          this.checkOk = true
        } else {
          this.checkAlert = { message: check.message, errors: check.errors }
        }
      }
    }
  },
  beforeDestroy () {
    if (this.tokenFile && !this.formSuccess) {
      api.removeuploadedfile(this.$store.getters['auth/apiKey'], this.tokenFile)
    }
  },
  methods: {
    async add (files) {
      this.errorUploadmessage = null
      this.fileName = files[0].name
      this.$q.icon.uploader.done = 'mdi-close-circle'
      await this.$sleep(1000)
      await this.$refs.uploader.upload()
    },
    uploaded (file, xhr) {
      this.tokenFile = JSON.parse(xhr.responseText).tokenFile
    },
    fail (file, xhr) {
      let message = JSON.parse(xhr.responseText).message
      this.tokenFile = null
      this.fileName = null
      this.checkAlert = null
      this.checkOk = false
      this.pending_checkcsv = false
      this.errorUploadmessage = message
      this.$refs.uploader.reset()
    },
    removebeforedone () {
      this.tokenFile = null
      this.fileName = null
      this.checkAlert = null
      this.errorUploadmessage = null
      this.checkOk = false
      this.pending_checkcsv = false
    },
    removedone () {
      api.removeuploadedfile(this.$store.getters['auth/apiKey'], this.tokenFile)
      this.tokenFile = null
      this.fileName = null
      this.checkAlert = null
      this.errorUploadmessage = null
      this.checkOk = false
      this.pending_checkcsv = false
    }
  }
}
</script>

<style scoped lang="stylus">
.myuploadapi.uploading /deep/ .q-if
  display none
</style>
