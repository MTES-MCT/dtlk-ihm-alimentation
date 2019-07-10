<template>
  <q-layout view="hHh lPr fff">
    <q-layout-header>
      <layout-banner-simple />
    </q-layout-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import LayoutBannerSimple from 'components/Layout/Banner/Simple'

export default {
  name: 'layout-not-authentified',
  components: {
    LayoutBannerSimple
  },
  data () {
    return {}
  }
}
</script>

<style scoped lang="stylus">

</style>
