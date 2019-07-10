<template @dragleave.prevent @dragenter.prevent @drop.prevent>
  <q-layout view="hhh lpr lfr">
    <q-layout-header reveal >
      <layout-banner-menu-button />
    </q-layout-header>
    <q-page-container>
      <account-login />
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
import LayoutBannerMenuButton from 'components/Layout/Banner/MenuButton'
import AccountLogin from 'components/Account/Login'

export default {
  name: 'layout-my-panel',
  components: {
    LayoutBannerMenuButton, AccountLogin
  },
  data () {
    return {}
  }
}
</script>

<style scoped lang="stylus">

</style>
