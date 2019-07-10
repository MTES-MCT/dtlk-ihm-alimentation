<template>
  <q-modal v-model="opened" @show="onshow" @hide="onhide" maximized class="q-ma-lg">
    <q-modal-layout v-if="message">
      <q-toolbar slot="header" class="text-bold" color="secondary">
        <q-toolbar-title class="text-weight-medium text-white">
          {{message.subject}}
        </q-toolbar-title>
        <q-item-side right icon="mdi-close-outline" color="white" class="cursor-pointer" @click.native="opened = false" />
      </q-toolbar>
      <div>
        <q-list dense>
          <q-item v-if="message.sender.isRobot">
            <q-item-side avatar="statics/robot.png" />
            <q-item-main class="text-small">{{message.sender.robot.name}}</q-item-main>
          </q-item>
          <q-item v-if="message.sender.isUser">
            <q-item-side v-if="message.sender.isDatalakeUser" letter="D" />
            <q-item-side v-else-if="message.sender.isIntranetUser" letter="I" />
            <q-item-side v-else avatar="statics/unknown.png" />
            <q-item-main class="text-small">{{message.sender.user.name}}</q-item-main>
          </q-item>
          <q-item>
            <q-item-side class="text-center">à</q-item-side>
            <q-item-main class="text-small">
              <q-chip v-for="(to, i) of message.to" :key="i" class="on-left">
                <template v-if="to.isRobot">{{to.robot.name}}</template>
                <template v-else>{{to.user.name}}</template>
              </q-chip>
            </q-item-main>
          </q-item>
          <q-item v-if="message.cc.length">
            <q-item-side class="text-center">à</q-item-side>
            <q-item-main class="text-small">
              <q-chip v-for="(cc, i) of message.cc" :key="i" class="on-left">
                <template v-if="cc.isRobot">{{cc.robot.name}}</template>
                <template v-else>{{cc.user.name}}</template>
              </q-chip>
            </q-item-main>
          </q-item>
          <q-item-separator />
          <q-item v-if="message.textHtml">
            <q-item-main class="text-small" v-html="message.textHtml" />
          </q-item>
          <q-item v-else>
            <q-item-main class="text-small"><pre>{{message.text}}</pre></q-item-main>
          </q-item>
        </q-list>
      </div>
    </q-modal-layout>
  </q-modal>
</template>

<script>
export default {
  name: 'messages-modal',
  data () {
    return {}
  },
  computed: {
    opened: {
      get () {
        return this.$store.state.messages.openModal
      },
      set (value) {
        this.$store.commit('messages/updateOpenModal', { open: value })
      }
    },
    message () {
      return this.$store.getters['messages/message']
    },
    firstLetterSenderUser () {
      return this.message.sender.user.name.substring(0, 1)
    }
  },
  methods: {
    async onshow () {
      console.log('open')
      if (this.message.read === false) {
        this.$store.dispatch('messages/markAs', { message: this.message, read: true })
      }
    },
    onhide () {
      console.log('close')
    }
  }
}
</script>

<style scoped lang="stylus">
pre
  white-space pre-wrap
</style>
