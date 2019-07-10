<template>
  <div v-if="!show">
    <span :class="textClass" v-html="nl2br(truncate(text))" />
    <a v-if="text.length >= length" @click="toggle()" :class="linkClass">voir plus</a>
  </div>
  <div v-else>
    <span :class="textClass" v-html="nl2br(text)" />
    <a @click="toggle()" v-if="text.length >= length" :class="linkClass">replier</a>
  </div>
</template>

<script>
export default {
  name: 'truncate',
  props: {
    text: String,
    length: { type: Number, default: 100 },
    textClass: { type: String, default: '' },
    linkClass: { type: String, default: '' }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    truncate (string) {
      return string ? string.toString().substring(0, this.length || 100) : ''
    },
    toggle () {
      this.show = !this.show
    },
    nl2br (string) {
      return string ? string.toString().replace(/\n/g, '<br />') : ''
    }
  }
}
</script>

<style lang="css" scoped>
  a {
    cursor: pointer;
  }
</style>
