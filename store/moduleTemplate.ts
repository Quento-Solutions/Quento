import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import firestore from '~/plugins/firestore'

@Module({ stateFactory: true, name: 'template', namespaced: true })
export default class TemplateModule extends VuexModule {

}