<template>
  <q-modal v-model="opened" @show="onshow" @hide="onhide" :content-css="{minWidth: '95vw', minHeight: '95vh'}">
    <q-modal-layout class="modalLayout">
      <q-toolbar slot="header" color="secondary" class="text-bold">
        <q-toolbar-title class="row items-center">
          <q-icon class="on-left" name="mdi-pencil" />Détail du fichier de données
        </q-toolbar-title>
        <q-btn flat @click="opened = false"><q-icon name="mdi-close-outline" /></q-btn>
      </q-toolbar>
      <div class="contentModal q-pa-md" v-if="datafile && dataset">
        <div class="bg-secondary text-white text-small q-mb-lg q-pa-md">
          <div class="q-mb-sm"><span class="text-bold on-left">Jeu de données :</span>{{dataset.title}}</div>
        </div>
        <div class="text-small q-px-md q-mb-md">
          <span class="text-bold text-secondary on-left">Identifiant Datalake :</span><pre>{{datafile.rid}}</pre>
        </div>
        <div class="text-small q-px-md q-mb-md">
          <span class="text-bold text-secondary on-left">Titre :</span><pre>{{datafile.title}}</pre>
        </div>
        <div class="text-small q-px-md q-mb-md">
          <span class="text-bold text-secondary on-left">Description :</span><pre>{{datafile.description}}</pre>
        </div>
        <div class="text-small q-px-md q-mb-md">
          <span class="text-bold text-secondary on-left">Date de publication :</span><pre>{{published}}</pre>
        </div>
        <div v-if="datafile.temporal_coverage" class="text-small q-px-md q-mb-md">
          <span class="text-bold text-secondary on-left">Couverture temporelle :</span><pre>du {{temporal_coverage_start}} au {{temporal_coverage_end}}</pre>
        </div>
        <div v-if="datafile.legal_notice" class="text-small q-px-md q-mb-md">
          <span class="text-bold text-secondary on-left">Source à mentionner :</span><pre>{{datafile.legal_notice}}</pre>
        </div>
        <div class="text-small q-px-md q-mb-md">
          <span class="text-bold text-secondary on-left">Données :</span>
          <template v-for="millesime of infoMillesimes">
            <q-item :key="millesime.number">
              <q-item-main class="text-small">
                <q-item-tile v-if="infoMillesimes.length > 1" label>Millesime {{millesime.number}}</q-item-tile>
                <q-item-tile sublabel>{{millesime.rows}} lignes et {{millesime.columns.length}} colonnes</q-item-tile>
                <q-item-tile sublabel><a :href="millesime.url" title="Lien internet de la millesime du fichier de données">{{millesime.url}}</a></q-item-tile>
              </q-item-main>
            </q-item>
          </template>
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
  name: 'datafiles-detail',
  data () {
    return {}
  },
  computed: {
    opened: {
      get () {
        return this.$store.state.mydatasets.openModalDetailDatafile
      },
      set (value) {
        this.$store.commit('mydatasets/updateOpenModal', { open: value, modal: 'openModalDetailDatafile' })
      }
    },
    dataset () {
      return this.$store.state.mydatasets.usedDatafile ? this.$store.state.mydatasets.usedDatafile.dataset : null
    },
    datafile () {
      return this.$store.state.mydatasets.usedDatafile ? this.$store.state.mydatasets.usedDatafile.datafile : null
    },
    published () {
      return date.formatDate(new Date(this.datafile.published), 'DD MMMM YYYY')
    },
    temporal_coverage_start () {
      return (this.datafile.temporal_coverage && this.datafile.temporal_coverage.start) ? date.formatDate(new Date(this.datafile.temporal_coverage.start), 'DD MMMM YYYY') : null
    },
    temporal_coverage_end () {
      return (this.datafile.temporal_coverage && this.datafile.temporal_coverage.end) ? date.formatDate(new Date(this.datafile.temporal_coverage.end), 'DD MMMM YYYY') : null
    },
    infoMillesimes () {
      return this.datafile.millesimes_info.map(v => ({ number: v.millesime, rows: v.rows, columns: v.columns, url: this.datafile.url + '?millesime=' + v.millesime })).sort((v1, v2) => (v1.number > v2.number) ? -1 : 1)
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
</style>
