<template>
  <div id="user-profile-view">
    <div id="user-view">
      <!-- Profile Card -->
      <VxCard class="mb-base" v-if="AuthUser && UserData">
        <!-- Avatar -->
        <!-- <div class="vx-row w-full justify-center p-2 font-bold" style>
          <div class="vx-col flex-1 text-2xl font-bold" id="account-info-col-1">My Profile</div>
        </div>-->
        <div class="vx-row w-full" style>
          <div class="vx-row w-full lg:w-1/2">
            <!-- Avatar Col -->
            <div class="vx-col" id="avatar-col">
              <div class="img-container mb-4">
                <img :src="AuthUser.photoURL" class="rounded-lg w-full" />
              </div>
            </div>

            <!-- Information - Col 1 -->
            <div class="vx-col flex-1 w-full md:text-lg text-2xl" id="account-info-col-1">
              <div class="vx-row font-bold text-3xl" style>{{ AuthUser.displayName }}</div>
              <div
                class="vx-row w-full text-2xl"
                style
              >Grade {{ UserData.currentGrade }} at {{ UserData.school }}</div>

              <div class="vx-row w-full my-2 items-center">
                <div class="font-bold text-xl mr-2 text-green">Level</div>
                <vs-avatar warn size="25">
                  <div class="font-bold text-base">{{userLevel}}</div>
                </vs-avatar>
              </div>

              <!-- MAKE A PROGRESSION BAR  -->
              <div class="vx-row w-full mt-6">
                <v-progress-linear
                  color="deep-purple accent-4"
                  height="11"
                  value="100%"
                  striped
                  style="background-color: #32CD32; z-index:2"
                  :style="`width: ${userExp}%`"
                ></v-progress-linear>
                <v-progress-linear
                  color="deep-purple accent-4"
                  height="11"
                  value="100%"
                  striped
                  style="background-color:gray; width:100%; margin-top: -0.8rem"
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
                v-for="(subject, index) in UserData.interestedSubjects"
                :key="index"
              >
                <i class="bx text-xl text-white mr-2" :class="getIcon(subject)" />
                {{ subject }}
              </div>
            </div>
            <div class="w-full p-2 md:px-8" style>
              <div
                class="p-2 rounded-lg border-solid border-gray-400 w-full font-medium"
              >{{ UserData.bio }}</div>
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
          <!-- /Information - Col 2 -->
          <!-- <div class="vx-col w-full flex" id="account-manage-buttons">
            <vs-button class="mr-4" size="large">
              <i class="bx bx-edit" />&nbsp; Edit
            </vs-button>
            <vs-button type="border" color="danger" size="large">
              <i class="bx bx-trash" />&nbsp; Delete
            </vs-button>
          </div>-->
        </div>
      </VxCard>

      <!-- User's Notes Card -->
      <VxCard class="mb-base mt-12" v-if="AuthUser && UserData">
        <div class="vx-col flex-1 w-full" id="account-info-col-1">
          <div class="vx-row font-bold text-2xl" style>{{ AuthUser.displayName }}'s Notes</div>
        </div>
        <!-- <div class="vx-col flex-1 w-full" id="account-info-col-1">
          {{ UserNotes }}
        </div>-->

        <v-layout row wrap>
          <v-flex
            xs12
            sm6
            md8
            lg3
            v-for="note in UserNotes"
            :key="note.uid"
            style="margin-top: 1.5rem;"
          >
            <nuxt-link :to="`/notes/${note.id}`">
              <v-card
                class="mx-auto"
                color="#26c6da"
                dark
                max-width="28rem"
                style="min-width: 11rem;"
              >
                <v-card-title>
                  <div
                    class="vx-row font-bold text-2xl"
                    style="margin-bottom: -0.75rem;"
                  >{{ note.title }}</div>
                </v-card-title>

                <v-card-text
                  class="headline font-weight-bold overflow-hidden"
                  style="min-height: 9.8rem; max-height: 9.8rem;"
                >{{note.contents}}</v-card-text>

                <v-card-actions style="margin-left: -0.75rem;">
                  <v-list-item class="grow">
                    <v-list-item-avatar color="grey darken-3" style="margin-right: 0.5rem;">
                      <v-img class="elevation-6" :src="AuthUser.photoURL"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{
                        AuthUser.displayName
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
          </v-flex>
        </v-layout>
      </VxCard>
    </div>
  </div>
</template>

<script lang="ts">
import userCard from '~/components/userCard.vue'
import { Component, Vue, Prop, mixins, Watch } from 'nuxt-property-decorator'
import UserMixin from '~/mixins/UserMixin'
import firestore from '~/plugins/firestore'

import { SubjectGroup_O, Subject_O, SubjectIconList } from '~/types/subjects'
import NotesCard from '~/components/NotesCard.vue'
import { Note_t, Note, Note_t_F } from '~/types/notes'
import 'vuesax'
@Component<UserProfile>({
  components: {
    NotesCard
  },
  mounted() {
    this.getUserNotes()
    // console.log('hello')
    // console.log(this.UserNotes)
  }
})
export default class UserProfile extends mixins(UserMixin) {
  UserNotes: Note[] = []
  UserEXP: any
  async getUserNotes() {
    if (!this.AuthUser) {
      return
    }
    const userId = this.AuthUser?.uid
    // console.log(this.AuthUser)
    const notesCollection = await firestore
      .collection('notes')
      .where('uid', '==', userId)
      .get()
    this.UserNotes = notesCollection.docs.map((doc) =>
      Note.fromFirebase(doc.data() as Note_t_F, doc.id)
    )

    console.log(this.UserEXP)
  }

  @Watch('AuthUser')
  onAuthChange(value: any, oldValue: any) {
    if (value) {
      this.getUserNotes()
    }
  }

  get userLevel() {
    return this.UserData?.progressionLevel || 0
  }

  get userExp() {
    console.log(this.UserData?.progressionExp)
    return (this.UserData?.progressionExp || 0) / 200
  }

  getIcon(subject: SubjectGroup_O | Subject_O) {
    return SubjectIconList[subject]
  }
  randomColor() {
    return Math.floor(Math.random() * 16777215).toString(16)
  }
}
</script>
<style lang="scss">
#avatar-col {
  width: 10rem;
}

#user-profile-view {
  table {
    td {
      vertical-align: top;
      min-width: 140px;
      padding-bottom: 0.8rem;
      word-break: break-all;
    }

    &:not(.permissions-table) {
      td {
        @media screen and (max-width: 370px) {
          display: block;
        }
      }
    }
  }
}

// #account-info-col-1 {
//   // flex-grow: 1;
//   width: 30rem !important;
//   @media screen and (min-width:1200px) {
//     & {
//       flex-grow: unset !important;
//     }
//   }
// }

@media screen and (min-width: 1201px) and (max-width: 1211px),
  only screen and (min-width: 636px) and (max-width: 991px) {
  #account-info-col-1 {
    width: calc(100% - 12rem) !important;
  }

  // #account-manage-buttons {
  //   width: 12rem !important;
  //   flex-direction: column;

  //   > button {
  //     margin-right: 0 !important;
  //     margin-bottom: 1rem;
  //   }
  // }
}
</style>
