import { SessionStorage } from 'quasar'
import api from '../api'

export default {
  levels: {
    'country-group': 'Groupement de pays',
    'country': 'Pays',
    'country-subset': 'Sous-ensemble de pays',
    'fr:region': 'Région',
    'fr:epci': 'Intercommunalité',
    'fr:departement': 'Département',
    'fr:collectivite': 'Collectivité d\'outre-mer',
    'fr:commune': 'Commune',
    'fr:arrondissement': 'Arrondissement',
    'fr:canton': 'Canton',
    'fr:iris': 'Iris (quartiers INSEE)'
  },
  topics: async () => {
    if (SessionStorage.get.item('ReferentielTopics')) return SessionStorage.get.item('ReferentielTopics')
    let topics = await api.gettopics()
    SessionStorage.set('ReferentielTopics', topics)
    return topics
  },
  licenses: async () => {
    if (SessionStorage.get.item('ReferentielLicenses')) return SessionStorage.get.item('ReferentielLicenses')
    let licenses = await api.getlicenses()
    SessionStorage.set('ReferentielLicenses', licenses)
    return licenses
  },
  frequencies: async () => {
    if (SessionStorage.get.item('ReferentielFrequencies')) return SessionStorage.get.item('ReferentielFrequencies')
    let frequencies = await api.getfrequencies()
    SessionStorage.set('ReferentielFrequencies', frequencies)
    return frequencies
  },
  granularities: async () => {
    if (SessionStorage.get.item('ReferentielGranularities')) return SessionStorage.get.item('ReferentielGranularities')
    let granularities = await api.getgranularities()
    SessionStorage.set('ReferentielGranularities', granularities)
    return granularities
  },
  tags: async () => {
    if (SessionStorage.get.item('ReferentielTags')) return SessionStorage.get.item('ReferentielTags')
    let tags = await api.gettags()
    SessionStorage.set('ReferentielTags', tags)
    return tags
  }
}
