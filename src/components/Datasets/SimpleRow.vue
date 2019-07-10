<template>
  <q-item @click.native="$router.push({ name: 'myorgdatasets', hash: '#id-' + dataset.id })">
    <q-item-side color="warning" icon="mdi-folder" />
    <q-item-main>
      <q-item-tile label>Fichier de données: {{dataset.title}}</q-item-tile>
      <q-item-tile sublabel>Mise-à-jour prévue avant le {{frequencyDate}}</q-item-tile>
    </q-item-main>
  </q-item>
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'datasets-simple-row',
  props: ['dataset'],
  data () {
    return {}
  },
  computed: {
    frequencyDate: function () {
      return date.formatDate(new Date(this.dataset.frequency_date), 'DD MMMM YYYY')
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
