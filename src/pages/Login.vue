<template>
  <q-page class="loginPage row text-justify">
    <account-login />
  </q-page>
</template>

<script>
import AccountLogin from 'components/Account/Login'

export default {
  name: 'page-notauthentified-default',
  components: { AccountLogin },
  data () {
    return {}
  }
}
</script>

<style scoped lang="stylus">
</style>
