<template>
  <q-page class="q-pa-md bg-grey-1">
    <messages-modal />
    <q-list link separator no-border>
      <q-list-header>
        <div class="q-headline text-secondary">Vos messages</div>
        <div v-if="messages.length" clas="q-caption">cliquez sur une message pour voir le détail</div>
        <div v-else>Vous n'avez pas de messages</div>
      </q-list-header>
      <messages-row v-for="message in messages" :key="message.id" :message="message" />
    </q-list>
    <q-inner-loading :visible="loading">
      <q-spinner-gears :size="50" color="secondary" />
      <br><br>
      <div class="text-secondary full-width text-center">Chargement de vos messages. Merci de patienter...</div>
    </q-inner-loading>
  </q-page>
</template>

<script>
import MessagesModal from 'components/Messages/Modal'
import MessagesRow from 'components/Messages/Row'

export default {
  name: 'my-messages',
  components: { MessagesRow, MessagesModal },
  data () {
    return {}
  },
  computed: {
    messages () {
      return this.$store.state.messages.list.slice(0).sort((messagea, messageb) => (new Date(messageb.timestamp)).getTime() - (new Date(messagea.timestamp)).getTime())
    },
    loading () {
      return this.$store.state.messages.pending_list
    }
  },
  created () {
    this.$store.dispatch('messages/initialize')
  }
}
</script>

<style scoped lang="stylus">

</style>
