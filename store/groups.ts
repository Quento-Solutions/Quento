import { Module, VuexModule, MutationAction,Mutation, Action } from 'vuex-module-decorators'

import firestore from '~/plugins/firestore'
import {Group, Group_t_F, Group_t} from '~/types/groups'


import {
  Grade_O,
  SubjectList,
  Subject_O,
  SortOptions_O
} from '~/types/subjects'
export interface FilterOptions {
  filterSubjects: Subject_O[]
  filterGrades: Grade_O
  sortSelect: SortOptions_O
}

@Module({ stateFactory: true, name: 'groups', namespaced: true })
export default class GroupsModule extends VuexModule {
  openGroupsModal = false
  addGroup: Group | null = null
  groupList: Group[] = [];
  sortBy = "createdAt";
  @Mutation
  public SET_GROUP_LIST(items: Group[])
  {
    this.groupList = items;
  }

  @Action({ rawError: true })
  public async GetGroups() {
    try {
      const query = await firestore.collection('groups').orderBy(this.sortBy).get();
      const items = query.docs.map(doc => Group.fromFirebase(doc.data() as Group_t_F, doc.id));
      this.SET_GROUP_LIST(items);
      console.log('banana');
      return;
    } catch (error) {
      console.log({ error })
    }
    return; 
  }
  @Action({ rawError: true })
  public async createGroup(group: Group ) {
    const newGroup : Group = Object.assign({}, group)
    if(group.id)
    {
      return await firestore.collection('groups').doc(group.id).update(Group.toFirebase(newGroup));
    }
    await firestore.collection('groups').add(Group.toFirebase(newGroup));
  }
  @Mutation
  private SET_ADD_GROUP(val: Group | null) {
    this.addGroup = val
  }

  @Action({ rawError: true })
  public SetAddGroup(val: Group | null) {
    this.SET_ADD_GROUP(val)
  }
  @Mutation
  private TOGGLE_GROUPS_MODULE(val: boolean) {
    this.openGroupsModal = val
  }

  @Action({ rawError: true })
  public ToggleGroupsModule(val: boolean) {
    this.TOGGLE_GROUPS_MODULE(val)
  }

}