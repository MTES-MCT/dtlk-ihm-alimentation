<template>
  <q-item highlight dense class="q-caption q-px-none q-py-xs" :class="{'animated infinite mypulse': attachment.notify_update}">
    <template v-if="attachment.pending_delete">
      <q-item-side color="secondary">
        <q-spinner-hourglass size="16" />
      </q-item-side>
      <q-item-main>
        <q-item-tile class="text-secondary text-bold" label>Suppression du fichier en cours</q-item-tile>
      </q-item-main>
    </template>
    <template v-else>
      <q-item-main inset>
        <q-item-tile class="text-secondary text-weight-medium" label>{{attachment.title}}</q-item-tile>
      </q-item-main>
      <q-item-side right icon="mdi-dots-vertical" class="cursor-pointer">
        <q-popover ref="popover">
          <q-list link dense class="no-border attachmentActions">
            <q-item dense class="q-caption" @click.native="[$refs.popover.hide(), openDetail()]">
              <q-item-side icon="mdi-magnify" />
              <q-item-main>
                <q-item-tile label>Détail</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item dense class="q-caption" @click.native="[$refs.popover.hide(), openEditMetadata()]">
              <q-item-side icon="mdi-pencil" />
              <q-item-main>
                <q-item-tile label>Éditer les métadonnées</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item dense class="q-caption" @click.native="[$refs.popover.hide(), openReplaceFile()]">
              <q-item-side icon="mdi-cloud-upload" />
              <q-item-main>
                <q-item-tile label>Remplacer le fichier</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item-separator />
            <q-item dense class="q-caption" @click.native="[$refs.popover.hide(), confirmDeletion()]">
              <q-item-side color="negative" icon="mdi-delete" />
              <q-item-main>
                <q-item-tile color="negative" label>Supprimer</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item-separator />
            <q-item dense class="q-caption" @click.native="[$refs.popover.hide(), showLogs()]">
              <q-item-side color="primary" icon="mdi-history" />
              <q-item-main>
                <q-item-tile color="primary" label>Voir les logs</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-popover>
      </q-item-side>
    </template>
  </q-item>
</template>

<script>
export default {
  name: 'attachments-row',
  props: ['attachment', 'dataset'],
  data () {
    return {}
  },
  watch: {},
  methods: {
    openDetail () {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalDetailAttachment', usedAttachment: { dataset: this.dataset, attachment: this.attachment } })
    },
    openEditMetadata () {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalEditAttachment', usedAttachment: { dataset: this.dataset, attachment: this.attachment } })
    },
    openReplaceFile () {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalReplaceAttachment', usedAttachment: { dataset: this.dataset, attachment: this.attachment } })
    },
    async confirmDeletion () {
      try {
        await this.$q.dialog({
          title: 'Demande de confirmation',
          color: 'secondary',
          message: 'Vous allez supprimer définitivement le fichier descriptif. Êtes-vous sûr ?',
          ok: 'Oui',
          cancel: 'Non, annuler !!'
        })
        await this.$store.dispatch('mydatasets/removeAttachment', { dataset: this.dataset, attachment: this.attachment })
      } catch (e) {}
    },
    showLogs () {
      this.$store.commit('mydatasets/updateOpenModal', { open: true, modal: 'openModalShowLogs', usedObjectLog: { dataset: this.dataset, attachment: this.attachment } })
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~quasar-styl'
.attachmentActions /deep/ .q-item .q-icon
  @extend .q-subheading
.attachmentActions /deep/ .q-item-side-left
  min-width unset
</style>
