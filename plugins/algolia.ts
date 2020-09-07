import algoliasearch from 'algoliasearch/lite'
import { algoliaConfig } from '~/envars'
export default algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey)
