<template>
  <div id="user-profile-view">
    <div id="user-view">
      <!-- Profile Card -->
      <VxCard class="mb-base" v-if="AuthUser && UserData">
        <!-- Avatar -->

        <div class="vx-row w-full" style>
          <div class="vx-row w-full lg:w-1/2">
            <!-- Information - Col 1 -->
            <div class="vx-col flex-1 w-full md:text-lg text-2xl" id="account-info-col-1">
              <div class="vx-row font-bold text-4xl" style>Friends</div>
            </div>

            <!-- Friends -->
            <div
              class="vx-row w-full justify-between items-center flex-no-wrap mt-4 ml-4"
              style="flex-wrap : nowrap"
            >
              <!-- Profile Picture -->
              <div class="justify-start w-5/6 m-0 vx-row items-center" style="flex-wrap: nowrap">
                <div>
                  <vs-avatar size="75" class="icon" @click.stop="$router.push(`/user/view/_id`)">
                    <img v-if="UserData.photoURL" :src="UserData.photoURL" />
                    <template slot="text" v-else>Vansh Sethi</template>
                  </vs-avatar>
                </div>
                <div class="md:pl-5" style=" min-width: 100%">
                  <!-- User name -->
                  <div class="md:text-2xl text-ginger-b truncate text-2xl">Vansh Sethi</div>
                  <div class="md:text-lg truncate text-2xl mb-10">Friends for: 2 days</div>
                </div>
              </div>
            </div>

            <!-- <div class="text-title w-full vx-col text-2xl px-10" style="">
              Subjects
            </div>-->
          </div>
          <!-- /Information - Col 1 -->

          <!-- /Information - Col 2 -->

          <!-- Information - Col 2 -->

          <!-- /Information - Col 2 -->
        </div>
      </VxCard>

      <!-- User's Notes Card -->
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
@Component<FriendRequests>({
  components: {
    NotesCard
  },
  mounted() {
    this.getUserNotes()
  }
})
export default class FriendRequests extends mixins(UserMixin) {
  linkDiscord() {
    const redirect_uri = encodeURIComponent(
      `${window.location.origin}/user/discord`
    )
    const discordOauthLink = `https://discord.com/api/oauth2/authorize?client_id=739600929287831685&redirect_uri=${redirect_uri}&response_type=code&scope=identify`
    // Simulate a mouse click:
    window.location.href = discordOauthLink
  }

  UserNotes: Note[] = []
  async getUserNotes() {
    if (!this.AuthUser) {
      return
    }
    const userId = this.AuthUser?.uid
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
    return Math.floor((this.UserData?.totalExp || 0) / 200)
  }

  get userExp() {
    const userExp = ((this.UserData?.totalExp || 0) % 200) / 2 // 200 exp points per level, its in percentage so multiply by 100.
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
