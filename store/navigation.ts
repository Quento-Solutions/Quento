import {
  Module,
  VuexModule,
  MutationAction,
  Action,
  Mutation
} from 'vuex-module-decorators'

export const NavigationOptions = {
  home: 'home',
  projects: 'projects',
  contact: 'contact',
  login : 'login',
  signup : 'signup',

} as const

export type NavigationOptionType = keyof typeof NavigationOptions

export interface NavigationState {
  currentPage: NavigationOptionType
}

@Module({ stateFactory: true, name: 'navigation', namespaced: true })
export default class NavigationModule extends VuexModule
  implements NavigationState {
  currentPage: NavigationOptionType = 'login'

  @Mutation
  private CHANGE_PAGE(page: NavigationOptionType) {
    this.currentPage = page
  }
  @Action
  public changePage(page : NavigationOptionType) {
    this.CHANGE_PAGE(page);
  }
}
