<template>
  <div id="user-profile-view">
    <div id="user-view">
      <!-- Profile Card -->
      <VxCard class="mb-base" v-if="AuthUser && UserData">
        <!-- Avatar -->

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
              <div class="vx-row w-full items-center text-ginger" style>
                <vs-button class="text-title text-2xl" style="font-size: 1.2rem" color="#7289DA" s @click="linkDiscord()">
                  <i class="bx bxl-discord text-4xl mr-2"/>
                  <div v-if="UserData.discordUsername" style="max-width: 40vw" class="truncate">{{ UserData.discordUsername }}</div>
                  <div v-else>Link Discord</div>
                </vs-button>
              </div>
              <div class="vx-row w-full my-2 items-center">
                <div class="font-bold text-xl mr-2 text-green">Level</div>
                <vs-avatar warn size="25">
                  <div class="font-bold text-base">{{ userLevel }}</div>
                </vs-avatar>
              </div>

              <!-- MAKE A PROGRESSION BAR  -->
              <div class="vx-row w-full mt-6">
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
        </div>
      </VxCard>

      <!-- User's Notes Card -->
      <VxCard class="mb-base mt-12" v-if="AuthUser && UserData">
        <div class="vx-col flex-1 w-full" id="account-info-col-1">
          <div class="vx-row font-bold text-2xl" style>{{ AuthUser.displayName }}'s Notes</div>
        </div>

        <div class="vx-row w-full">
          <div class="vx-col w-full md:w-1/2 lg:w-1/4" v-for="note in UserNotes" :key="note.uid">
            <nuxt-link :to="`/notes/${note.id}`">
              <v-card class="my-4 overflow-hidden" id="userCard" color="#26c6da" dark width="100%">
                <v-card-title>
                  <div class="vx-row font-bold text-2xl">{{ note.title }}</div>
                </v-card-title>

                <v-card-text
                  class="overflow-hidden text-white md-container"
                  v-html="$md.render(note.contents)"
                  style="max-height: 20vh; color: white;"
                ></v-card-text>

                <v-card-actions style="margin-left: -0.75rem;">
                  <v-list-item class="grow">
                    <v-list-item-avatar color="grey darken-3" style="margin-right: 0.5rem;">
                      <v-img class="elevation-6" :src="AuthUser.photoURL"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{ AuthUser.displayName }}</v-list-item-title>
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
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, mixins, Watch } from 'nuxt-property-decorator'
import UserMixin from '~/mixins/UserMixin'
import firestore from '~/plugins/firestore'

import { SubjectGroup_O, Subject_O, SubjectIconList } from '~/types/subjects'
import NotesCard from '~/components/NotesCard.vue'
import { Note_t, Note, Note_t_F } from '~/types/notes'
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

  linkDiscord()
  {
    const redirect_uri = encodeURIComponent(`${window.location.origin}/user/discord`);
    console.log({redirect_uri})
    const discordOauthLink = `https://discord.com/api/oauth2/authorize?client_id=739600929287831685&redirect_uri=${redirect_uri}&response_type=code&scope=identify`
    // Simulate a mouse click:
    window.location.href = discordOauthLink;
  }

  UserNotes: Note[] = []
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
    const userExp =  (this.UserData?.progressionExp || 0) / 2 // 200 exp points per level, its in percentage so multiply by 100.
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

@media screen and (min-width: 1201px) and (max-width: 1211px),
  only screen and (min-width: 636px) and (max-width: 991px) {
  #account-info-col-1 {
    width: calc(100% - 12rem) !important;
  }
}
</style>
