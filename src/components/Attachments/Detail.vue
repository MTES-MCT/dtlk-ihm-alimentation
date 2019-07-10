<template>
  <q-modal v-model="opened" @show="onshow" @hide="onhide" :content-css="{minWidth: '95vw', minHeight: '95vh'}">
    <q-modal-layout class="modalLayout">
      <q-toolbar slot="header" color="secondary" class="text-bold">
        <q-toolbar-title class="row items-center">
          <q-icon class="on-left" name="mdi-pencil" />Détail du fichier descriptif
        </q-toolbar-title>
        <q-btn flat @click="opened = false"><q-icon name="mdi-close-outline" /></q-btn>
      </q-toolbar>
      <div class="contentModal q-pa-md" v-if="attachment && dataset">
        <div class="bg-secondary text-white text-small q-mb-lg q-pa-md">
          <div class="q-mb-sm"><span class="text-bold on-left">Jeu de données :</span>{{dataset.title}}</div>
        </div>
        <div class="text-small q-px-md q-mb-md">
          <span class="text-bold text-secondary on-left">Identifiant Datalake :</span><pre>{{attachment.rid}}</pre>
        </div>
        <div class="text-small q-px-md q-mb-md">
          <span class="text-bold text-secondary on-left">Titre :</span><pre>{{attachment.title}}</pre>
        </div>
        <div class="text-small q-px-md q-mb-md">
          <span class="text-bold text-secondary on-left">Description :</span><pre>{{attachment.description}}</pre>
        </div>
        <div class="text-small q-px-md q-mb-md">
          <span class="text-bold text-secondary on-left">Date de publication :</span><pre>{{published}}</pre>
        </div>
        <div class="text-small q-px-md q-mb-md">
          <span class="text-bold text-secondary on-left">Fichier :</span><br /><a class="attachmentUrl" :href="attachment.url" title="Ouvrir le fichier" target="_blank">{{attachment.url}}</a>
        </div>
        <div class="row justify-end q-mt-lg">
          <q-btn small outline @click="opened = false" color="secondary"><q-icon name="mdi-close-outline" class="on-left" />Fermer</q-btn>
        </div>
      </div>
    </q-modal-layout>
  </q-modal>
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'attachments-detail',
  data () {
    return {}
  },
  computed: {
    opened: {
      get () {
        return this.$store.state.mydatasets.openModalDetailAttachment
      },
      set (value) {
        this.$store.commit('mydatasets/updateOpenModal', { open: value, modal: 'openModalDetailAttachment' })
      }
    },
    dataset () {
      return this.$store.state.mydatasets.usedAttachment ? this.$store.state.mydatasets.usedAttachment.dataset : null
    },
    attachment () {
      return this.$store.state.mydatasets.usedAttachment ? this.$store.state.mydatasets.usedAttachment.attachment : null
    },
    published () {
      return date.formatDate(new Date(this.attachment.published), 'DD MMMM YYYY')
    }
  },
  created () {},
  methods: {
    onshow () {
      console.log('open')
    },
    onhide () {
      console.log('close')
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~quasar-styl'
.modalLayout /deep/ .q-layout-header
  @extend .no-shadow
pre
  @extend .q-my-none, .q-ml-sm
  white-space pre-line
.attachmentUrl
  font-size 0.8em
  word-wrap break-word
  @extend .q-ml-sm
</style>
