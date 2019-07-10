<template>
  <q-page class="q-pa-xl bg-grey-1">
    <div class="q-display-2 q-mb-md text-secondary">Explorer le Datalake</div>
    <div class="q-mt-md">
      <q-alert>Must be implemented</q-alert>
      <q-tree class="q-mt-md" :nodes="nodesExplore" node-key="label" />
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'explore',
  data () {
    return {
      nodesExplore: [
        { label: 'Jeux de données' },
        { label: 'Organisations', children: [{ label: 'organisation1' }, { label: 'organisation2' }] },
        { label: 'Utilisateurs' },
        { label: 'Référentiels', children: [{ label: 'Mot-clés' }, { label: 'Thèmes' }, { label: 'Granularités' }] }
      ]
    }
  },
  methods: {}
}
</script>

<style scoped lang="stylus">

</style>
