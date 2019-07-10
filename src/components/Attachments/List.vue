<template>
  <q-list dense no-border class="no-padding q-mb-xs">
    <transition-group appear enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
      <q-item v-if="!attachments || !attachments.length" key="noattachment" dense class="q-caption q-px-none q-py-xs">
        <q-item-main inset>
          <q-item-tile class="text-black text-weight-bold" label>Aucun fichier descriptif n'est associé à ce jeu de données</q-item-tile>
        </q-item-main>
      </q-item>
      <attachments-row v-for="attachment in attachments" :key="attachment.rid" :dataset="dataset" :attachment="attachment" />
    </transition-group>
  </q-list>
</template>

<script>
import AttachmentsRow from 'components/Attachments/Row'

export default {
  name: 'attachments-list',
  props: ['attachments', 'dataset'],
  components: { AttachmentsRow },
  data () {
    return {}
  },
  created: function () {},
  methods: {}
}
</script>

<style scoped lang="stylus">

</style>
