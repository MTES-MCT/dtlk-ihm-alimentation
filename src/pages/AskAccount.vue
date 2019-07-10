<template>
  <q-page class="askAccountPage row text-justify">
    <q-card class="askAccountCard absolute-center col-xs-12 col-sm-12 col-md-6" v-show="!isDisabled && !finishedWithoutErrors">
      <q-card-media class="avatar text-center bg-secondary">
        <img src="statics/user.png">
        <q-card-title slot="overlay">Demander la création d'un compte</q-card-title>
      </q-card-media>
      <q-card-separator />
      <div>
        <q-card-main>
          <q-stepper ref="stepper" v-model="currentStep" class='no-shadow' alternative-labels contractable>
            <q-step name="identity" title="Identité" :error="$v.identityGroup.$error">
              <q-field icon="mdi-account-card-details" :error="$v.lastname.$error" error-label="Le champ est requis">
                <q-input color="secondary" v-model="lastname" float-label="Votre nom" @blur="$v.lastname.$touch" />
              </q-field>
              <br>
              <q-field inset="icon" :error="$v.firstname.$error" error-label="Le champ est requis">
                <q-input color="secondary" v-model="firstname" float-label="Votre prénom" @blur="$v.firstname.$touch" />
              </q-field>
              <br>
              <q-field icon="mdi-at" :error="$v.email.$error" error-label="Vous devez saisir une adresse mail valide">
                <q-input color="secondary" v-model="email" float-label="Votre adresse électronique" @blur="$v.email.$touch" />
              </q-field>
            </q-step>
            <q-step name="business" title="Métier" :error="$v.businessGroup.$error">
              <q-field icon="mdi-account-multiple" :error="$v.service.$error" error-label="Le champ est requis">
                <q-input color="secondary" v-model="service" float-label="Votre service" @blur="$v.service.$touch" />
              </q-field>
              <br>
              <q-field icon="mdi-certificate" :error="$v.job.$error" error-label="Le champ est requis">
                <q-input color="secondary" v-model="job" float-label="Votre fonction" @blur="$v.job.$touch" />
              </q-field>
            </q-step>
            <q-step name="more" title="Commentaires" :error="$v.moreGroup.$error">
              <q-field icon="mdi-account-multiple-plus" :error="$v.organization.$error" error-label="Vous devez choisir une organisation dans la liste">
                <q-select color="secondary" v-model="organization" float-label="L'organisation à laquelle vous souhaitez appartenir" :options="organizations" clearable @blur="$v.organization.$touch"></q-select>
              </q-field>
              <br>
              <q-field icon="mdi-comment">
                <q-input type="textarea" color="secondary" v-model="comments" float-label="Un mot à rajouter ?" :rows="5" />
              </q-field>
            </q-step>
          </q-stepper>
        </q-card-main>
        <q-card-actions align="between" class="stepperActions reverse">
          <q-btn v-if="currentStep !== 'more'" outline color="secondary" @click="nextStep" size="md" label="Suivant" title="Poursuivre le formulaire" />
          <q-btn v-if="currentStep === 'more'" outline color="primary" @click="submit" size="md" label="Valider" title="Valider l'envoi de vos informations" />
          <q-btn v-if="currentStep !== 'identity'" outline color="secondary" @click="$refs.stepper.previous()" size="md" label="Précédent" title="Revenir en arrière" />
        </q-card-actions>
        <q-card-separator />
        <q-card-actions align="between">
          <q-btn flat color="secondary" @click="$router.push({name: 'login'})" size="sm" label="Annuler" title="Retour à la page d'authentification" />
        </q-card-actions>
      </div>
    </q-card>
    <q-inner-loading :visible="isDisabled">
      <q-spinner-gears :size="50" color="secondary" />
      <br><br>
      <div class="text-secondary full-width text-center">Nous envoyons vos informations. Merci de patienter...</div>
    </q-inner-loading>
    <q-card class="askAccountCard absolute-center col-xs-12 col-sm-12 col-md-6" v-show="finishedWithoutErrors">
      <q-card-media class="avatar text-center bg-secondary">
        <img src="statics/user.png">
        <q-card-title slot="overlay">Créer un compte</q-card-title>
      </q-card-media>
      <q-card-separator />
      <div>
        <q-card-main>
          Vos informations ont bien été envoyées.<br><br> Vous recevrez un courrier électronique lorsqu'elles auront été traitées.
        </q-card-main>
        <q-card-actions align="center">
          <q-btn color="secondary" @click="$router.push({name: 'login'})" size="md" label="Ok" title="Retour à la page d'authentification" />
        </q-card-actions>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import api from '../api'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'account-ask',
  mixins: [validationMixin],
  data () {
    return {
      isDisabled: false,
      currentStep: 'identity',
      firstname: null,
      lastname: null,
      email: null,
      service: null,
      job: null,
      organization: null,
      comments: null,
      organizations: [],
      finishedWithoutErrors: false
    }
  },
  mounted () {
    this.organizations = api.getorganizations().then(organizations => { this.organizations = organizations.map(organization => { return { value: organization.id, label: organization.acronym, sublabel: organization.title } }) })
  },
  computed: {
    formData () {
      let formData = {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        service: this.service,
        job: this.job
      }
      if (this.organization) formData.organization = this.organization
      if (this.comments) formData.comments = this.comments
      return formData
    }
  },
  validations: {
    firstname: {
      required
    },
    lastname: {
      required
    },
    email: {
      required,
      email
    },
    service: {
      required
    },
    job: {
      required
    },
    organization: {
      in (value) {
        if (value) return this.organizations.find(organization => organization.value === value)
        return true
      }
    },
    identityGroup: ['firstname', 'lastname', 'email'],
    businessGroup: ['service', 'job'],
    moreGroup: ['organization']
  },
  methods: {
    nextStep () {
      if (this.currentStep === 'identity') {
        if (this.$v.identityGroup.$invalid) {
          this.$v.identityGroup.$touch()
          return
        }
      }
      if (this.currentStep === 'business') {
        if (this.$v.businessGroup.$invalid) {
          this.$v.businessGroup.$touch()
          return
        }
      }
      this.$refs.stepper.next()
    },
    async submit () {
      this.$v.$reset()
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      this.isDisabled = true
      try {
        await this.$sleep(2000)
        await api.askaccount(this.formData)
        this.finishedWithoutErrors = true
      } catch (error) {
        this.$q.notify({ type: 'negative', message: error.message, position: 'top' })
      } finally {
        this.isDisabled = false
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.avatar
  padding 10px
.avatar > img
  max-width 100px
  display inline
.askAccountCard /deep/ .q-card-main
  padding-bottom 0
.stepperActions
  margin-bottom 10px
</style>
