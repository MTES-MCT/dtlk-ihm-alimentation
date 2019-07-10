<template>
  <q-item  @click.native="openModalMessage">
    <q-item-side :color="colorStatus" :icon="iconStatus" @click.native.stop="markMessage" />
    <q-item-main>
      <q-item-tile label :text-color="colorStatus" :class="classStatus">{{senderName}}</q-item-tile>
      <q-item-tile sublabel>{{message.subject}}</q-item-tile>
    </q-item-main>
    <q-item-side right class="text-center">
      <q-chip square icon="mdi-calendar-clock" class="q-caption">
        {{displayDate}}<br>{{displayTime}}
      </q-chip>
      <q-icon v-if="!message.pending_delete" name="mdi-delete" class="on-right" @click.native.stop="deleteMessage" />
      <q-spinner-hourglass v-if="message.pending_delete" class="on-right" />
    </q-item-side>
  </q-item>
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'messages-row',
  props: ['message'],
  data () {
    return {}
  },
  computed: {
    iconStatus: function () {
      if (this.message.read === true) return 'mdi-email-open'
      return 'mdi-email'
    },
    colorStatus: function () {
      if (this.message.read === true) return 'light'
      return 'primary'
    },
    classStatus: function () {
      if (this.message.read === true) return ''
      return 'text-bold'
    },
    senderName () {
      if (this.message.sender.isRobot) return this.message.sender.robot.name
      return this.message.sender.user.name
    },
    displayDate () {
      return date.formatDate(new Date(this.message.timestamp), 'DD MMMM YYYY')
    },
    displayTime () {
      return date.formatDate(new Date(this.message.timestamp), 'HH:mm')
    }
  },
  methods: {
    openModalMessage: function () {
      this.$store.commit('messages/updateOpenModal', { open: true, messageId: this.message.id })
    },
    deleteMessage: function () {
      this.$store.dispatch('messages/deleteMessage', { message: this.message })
    },
    markMessage: function () {
      this.$store.dispatch('messages/markAs', { message: this.message, read: !this.message.read })
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
