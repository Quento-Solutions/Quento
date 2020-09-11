<template>
  <div id="user-profile-view">
    <div id="user-view">
      <!-- Profile Card -->
      <VxCard class="mb-base" v-if="userInfo">
        <!-- Avatar -->

        <div class="vx-row w-full" style>
          <div class="vx-row w-full lg:w-1/2">
            <!-- Avatar Col -->
            <div class="vx-col" id="avatar-col">
              <div class="img-container mb-4">
                <img
                  :src="userInfo.photoURL"
                  class="rounded-lg w-full"
                  style="max-height:150px; max-width:150px"
                />
              </div>
            </div>

            <!-- Information - Col 1 -->
            <div class="vx-col flex-1 w-full md:text-lg text-2xl" id="account-info-col-1">
              <div class="vx-row font-bold text-3xl" style>
                <span style="margin-right:0.8rem">{{ userInfo.displayName }}</span>
                <vs-button
                  color="success"
                  type="filled"
                  size="medium"
                  class="ml-"
                  v-if="!pendingFollowing && !acceptedFollowing"
                  @click="followUser()"
                >Follow</vs-button>
                <vs-button
                  color="warn"
                  type="filled"
                  size="medium"
                  class="ml-"
                  v-if="pendingFollowing"
                >
                  Follow Request Pending
                  <i
                    class="bx bx-x-circle text-xl text-white ml-2"
                    id="remove_icon"
                    @click="removePending()"
                  />
                </vs-button>
                <vs-button
                  color="danger"
                  type="filled"
                  size="medium"
                  class="ml-"
                  v-if="acceptedFollowing"
                  @click="unFollowFriend()"
                >Unfollow</vs-button>
                <vs-button
                  color="success"
                  type="filled"
                  size="medium"
                  class="ml-"
                  v-if="personFollowsYou"
                >Follows You</vs-button>
              </div>
              <div
                class="vx-row w-full text-2xl"
                style
              >Grade {{ userInfo.currentGrade }} at {{ userInfo.school }}</div>
              <div class="vx-row w-full items-center text-ginger" style></div>
              <div class="vx-row w-full my-2 items-center">
                <div class="font-bold text-xl mr-2 text-green">Level</div>
                <vs-avatar warn size="25">
                  <div class="font-bold text-base">{{ userLevel }}</div>
                </vs-avatar>
              </div>

              <!-- MAKE A PROGRESSION BAR  -->
              <div class="vx-row w-full mt-8 mb-2">
                <v-progress-linear
                  color="deep-purple accent-4"
                  height="11"
                  value="100%"
                  striped
                  style="background-color: #32cd32; z-index: 2;"
                  :style="`width: ${userExp}%`"
                ></v-progress-linear>
                <v-progress-linear
                  color="deep-purple accent-4"
                  height="11"
                  value="100%"
                  striped
                  style="
                    background-color: gray;
                    width: 100%;
                    margin-top: -0.8rem;
                    
                  "
                ></v-progress-linear>
              </div>
            </div>

            <!-- <div class="text-title w-full vx-col text-2xl px-10" style="">
              Subjects
            </div>-->
            <div class="w-full vx-row p-2 items-center text-sm">
              <div
                class="rounded-full px-4 py-2 vx-row items-center text-ginger text-white mx-2 my-1"
                :style="`background-color: #${randomColor()}`"
                v-for="(subject, index) in userInfo.interestedSubjects"
                :key="index"
              >
                <i class="bx text-xl text-white mr-2" :class="getIcon(subject)" />
                {{ subject }}
              </div>
            </div>
            <div class="w-full p-2 md:px-8" style>
              <div
                class="p-2 rounded-lg border-solid border-gray-400 w-full font-medium"
              >{{ userInfo.bio }}</div>
            </div>
          </div>
          <!-- /Information - Col 1 -->
          <div class="vx-row w-full lg:w-1/2" style>
            <div class="vx-col w-full" style></div>
          </div>
          <!-- /Information - Col 2 -->

          <!-- Information - Col 2 -->
          <div class="vx-row w-full lg:w-1/2" style>
            <div class="vx-col w-full" style></div>
          </div>
          <!-- <div class="w-full p-2 md:px-8" style>
            <vs-button color="warn" type="filled" size="large" to="/user/edit">Edit Profile</vs-button>
          </div>-->
          <!-- /Information - Col 2 -->
        </div>
      </VxCard>

      <!-- User's Notes Card -->
      <VxCard class="mb-base mt-12" v-if="userInfo">
        <div class="vx-col flex-1 w-full" id="account-info-col-1">
          <div class="vx-row font-bold text-2xl" style>{{ userInfo.displayName }}'s Notes</div>
        </div>

        <div class="vx-row w-full">
          <div class="vx-col w-full md:w-1/2 lg:w-1/4" v-for="note in UserNotes" :key="note.id">
            <nuxt-link :to="`/notes/${note.id}`">
              <v-card class="my-4 overflow-hidden" id="userCard" color="#26c6da" dark width="100%">
                <v-card-title>
                  <div class="vx-row font-bold text-2xl">{{ note.title }}</div>
                </v-card-title>

                <v-card-text
                  class="overflow-hidden text-white md-container"
                  v-html="$md.render(note.contents)"
                  style="max-height: 20vh; color: white; min-height: 20vh;"
                ></v-card-text>

                <v-card-actions style="margin-left: -0.75rem;">
                  <v-list-item class="grow">
                    <v-list-item-avatar color="grey darken-3" style="margin-right: 0.5rem;">
                      <v-img class="elevation-6" :src="userInfo.photoURL"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{
                        userInfo.displayName
                        }}
                      </v-list-item-title>
                    </v-list-item-content>

                    <v-row align="center" justify="end" style="margin-right: 0.2rem;">
                      <v-icon class="mr-1">mdi-heart</v-icon>
                      <span class="subheading mr-2">{{ note.upVotes }}</span>
                      <span class="mr-1"></span>
                      <v-icon class="mr-1">mdi-eye</v-icon>
                      <span class="subheading">{{ note.views }}</span>
                    </v-row>
                  </v-list-item>
                </v-card-actions>
              </v-card>
            </nuxt-link>
          </div>
        </div>
      </VxCard>
      <vs-alert color="danger" v-if="docNotFound">
        <template #title>Something Went Wrong</template>
        <b>Sorry!</b> Something went wrong when fetching the Note. Please Try
        Again.
      </vs-alert>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Vue, Prop, mixins} from 'nuxt-property-decorator'
import firestore from '~/plugins/firestore'
import {UserData} from '~/types/user'
import {SubjectIconList, SubjectGroup_O, Subject_O} from '~/types/subjects'
import {Note_t, Note, Note_t_F} from '~/types/notes'
import UserMixin from '~/mixins/UserMixin'
import firebase from 'firebase/app'

@Component<UserPage>({
  components: {},
  async mounted() {
    await this.fetchUser()
    await this.getUserNotes()
  }
})
export default class UserPage extends mixins(UserMixin) {
  userId: string | null = null
  userInfo: UserData | null = null
  UserNotes: Note[] = []
  docNotFound = false

  async removePending() {
    const loading = this.$vs.loading()
    try {
      const doc = await firestore
        .collection('users')
        .doc(this.AuthUser?.uid)
        .update({
          pendingFollowing: firebase.firestore.FieldValue.arrayRemove(
            this.userId
          )
        })

      const doc2 = await firestore
        .collection('users')
        .doc(this.userId as string)
        .collection('followers')
        .doc(this.AuthUser?.uid)
        .delete()
    } catch (e) {
      console.log(e)
    }
    loading.close()
  }

  get pendingFollowing() {
    return this.userId && this.UserData?.pendingFollowing?.includes(this.userId)
  }

  get acceptedFollowing() {
    return this.userId && this.UserData?.following?.includes(this.userId)
  }
  get personFollowsYou() {
    return (
      this.AuthUser?.uid &&
      this.userInfo?.following?.includes(this.AuthUser?.uid)
    )
  }

  async fetchUser() {
    const loading = this.$vs.loading()

    try {
      this.userId = this.$route.params.id
      const doc = await firestore.doc(`users/${this.userId}`).get()
      if (!doc.exists) {
        this.docNotFound = true
        loading.close()
        return
      }
      const userData2 = doc.data() as UserData

      this.userInfo = Object.assign({}, userData2)
      loading.close()
      return
    } catch (error) {
      this.docNotFound = true
      loading.close()
      console.error({error})
      return
    }
  }

  async unFollowFriend(uid: string) {
    const loading = this.$vs.loading()

    const doc = await firestore
      .collection('users')
      .doc(this.AuthUser?.uid)
      .update({
        following: firebase.firestore.FieldValue.arrayRemove(this.userId)
      })

    const unFollowFriendDoc = firestore
      .collection('users')
      .doc(this.userId as string)
      .collection('followers')
      .doc(this.AuthUser?.uid)
      .delete()
    // this.$router.go((this.$router.currentRoute as unknown) as number)

    loading.close()
  }

  get seePrivateNotes() {
    return (
      this.AuthUser &&
      (this.userId === this.AuthUser.uid || this.acceptedFollowing)
    )
  }

  async followUser() {
    const loading = this.$vs.loading()
    var length_of_following: number = 0
    var length_of_pendingFollowing: number = 0
    if (this.UserData?.following?.length == undefined) {
      length_of_following = 0
    } else {
      length_of_following = this.UserData?.following.length
    }

    if (this.UserData?.pendingFollowing?.length == undefined) {
      length_of_pendingFollowing = 0
    } else {
      length_of_pendingFollowing = this.UserData?.pendingFollowing?.length
    }
    if (length_of_following + length_of_pendingFollowing >= 10) {
      this.$vs.notification({
        title: "Already following 10+ people. Can't follow more.",
        color: 'warn'
      })
      loading.close()
      return
    }

    try {
      const userSide = await firestore
        .collection('users')
        .doc(this.AuthUser?.uid as string)
        .update({
          pendingFollowing: firebase.firestore.FieldValue.arrayUnion(
            this.userId
          )
        })

      const profileSide = await firestore
        .collection('users')
        .doc(this.userId as string)
        .collection('followers')
        .doc(this.AuthUser?.uid)
        .set({
          displayName: this.UserData?.displayName,
          photoURL: this.UserData?.photoURL,
          createdAt: new Date(),
          uid: this.AuthUser?.uid,
          accepted: false
        })

      // this.$router.go((this.$router.currentRoute as unknown) as number)

      // const new_query = await firestore.collection('notes').where(firebase.firestore.FieldPath.documentId(), 'in', [uid1, uid2])
    } catch (error) {
      console.log(error)
    }
    loading.close()
  }

  async getUserNotes() {
    if (!this.userInfo) {
      return
    }
    let notesQuery = await firestore
      .collection('notes')
      .where('uid', '==', this.userId)
      .orderBy('createdAt', 'desc')
    if (!this.seePrivateNotes) {
      notesQuery = notesQuery.where('private', '==', false)
    }
    const notesCollection = await notesQuery.get()
    this.UserNotes = notesCollection.docs.map((doc) =>
      Note.fromFirebase(doc.data() as Note_t_F, doc.id)
    )
  }

  get userLevel() {
    return Math.floor((this.userInfo?.totalExp || 0) / 200)
  }

  get userExp() {
    const userExp = ((this.userInfo?.totalExp || 0) % 200) / 2 // 200 exp points per level, its in percentage so multiply by 100.
    return userExp
  }

  getIcon(subject: SubjectGroup_O | Subject_O) {
    return SubjectIconList[subject]
  }

  randomColor() {
    return Math.floor(Math.random() * 16777215).toString(16)
  }
}
</script>