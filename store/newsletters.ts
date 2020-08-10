import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

import firestore from '~/plugins/firestore'
import {Newsletter, Newsletter_t_F} from '~/types/newsletters'

@Module({ stateFactory: true, name: 'newsletters', namespaced: true })
export default class NewslettersModule extends VuexModule {

  newsletterList : Newsletter[] = [];
  sortBy = "createdAt";

  @Mutation
  private SET_NEWSLETTER_LIST(items : Newsletter[])
  {
    this.newsletterList = items;
  }

  @Action({ rawError: true })
  public async GetNewsletters() {
    try {
      const query = await firestore.collection('newsletters').orderBy(this.sortBy).get();
      const items = query.docs.map(doc => Newsletter.fromFirebase(doc.data() as Newsletter_t_F));
      this.SET_NEWSLETTER_LIST(items);
      return;
    } catch (error) {
      console.log({ error })
    }
    return; 
  }
}