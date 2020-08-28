import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import firestore from '~/plugins/firestore'
import { firestore as FirestoreModule } from 'firebase/app'
import { authStore } from '~/store'
import { Grade_O, Subject_O } from '~/types/subjects'
import { School_O } from '~/types/schools'
@Module({ stateFactory: true, name: 'userGuide', namespaced: true })
export default class UserGuideModule extends VuexModule {
  UserGuideClosed = false
  UserInfoOpen = true

  public get userInfoPromptOpen() {
    return this.UserInfoOpen && !!authStore.user && !!authStore.userData && !authStore.userData.userInformationAdded
  }

  public get showUserGuide() {
    // Dont show if user info prompt is still up.
    return (
      !this.userInfoPromptOpen &&
      !!authStore.userData &&
      !(this.UserGuideClosed || authStore.userData?.userGuideClosed)
    )
  }
  @Mutation
  public SET_GUIDE_CLOSED(val: boolean) {
    this.UserGuideClosed = val
  }
  @Mutation
  public SET_INFO_OPEN(val: boolean) {
    this.UserInfoOpen = val
  }
  @Action({ rawError: true })
  public async SetUserGuideClosed(value: boolean) {
    await firestore.collection('users').doc(authStore.user?.uid).update({
      userGuideClosed: value
    })
    return await authStore.refreshUserData()
  }

    @Action({ rawError: true })
    public async SetUserInformation({ interestedSubjects, currentGrade, school, bio }:
    {interestedSubjects: Subject_O[], currentGrade: Grade_O, school: School_O, bio: string })
 
    {
        const userId = authStore.user?.uid
        await firestore.collection('users').doc(userId).update({ 
            interestedSubjects, currentGrade, school, bio, userInformationAdded : true
        });
        return await authStore.refreshUserData();
    }
}
