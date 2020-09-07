<template>
  <div id="newsletter-content-container">
    <vs-dialog v-model="kickModalOpen">
      <template #header>
        <div class="p-2 text-ginger-b text-3xl">Are You Sure You Want To Continue?</div>
      </template>
      <div class="p-2" style>
        <div
          v-if="kickUser.id !== AuthUser.uid"
        >Are you sure you want to remove {{kickUser.displayName}}?</div>
        <div v-else>Are you sure you want to leave this group?</div>
      </div>
      <template #footer>
        <div class="pb-8" style>
          <vs-button danger class="float-right" @click="KickOrLeave()">
            <div class="px-2 text-ginger-b text-xl" style>Confirm</div>
          </vs-button>
        </div>
      </template>
    </vs-dialog>
    <input
      type="text"
      :value="JoinToken"
      id="joinInput"
      style="position : absolute; z-index : -10000000"
    />

    <div class="vx-row justify-center w-full" v-if="group">
      <VxCard class="mb-6 w-24 min-w-full" style="border-radius: 0.8rem;">
        <template slot="no-body">
          <div
            class="text-white flex flex-row background-cover p-4 md:p-8 justify-between w-full"
            :style="backgroundGradient(group.backgroundImageUrl)"
            style="min-height: 20vmax; border-radius: 0.6rem;"
          >
            <div
              class="text-white text-title text-6xl font-medium block md:truncate"
              style="line-height: 1.125; min-width: 0;"
            >{{group.title}}</div>
            <div class="" style="display: flex">
              <vs-tooltip style="width: max-content">
                <div
                  class="rounded-full w-max-content px-1 mr-2"
                  style="width: max-content"
                  :class="group.approved ? ' bg-green-400' : 'bg-orange-400'"
                >
                  <i
                    class="bx text-5xl"
                    :class="group.approved ? ' bx-check' : 'bx-dots-horizontal'"
                  />
                </div>
                <template #tooltip>{{group.approved ? 'Verified' : 'Pending Approval'}}</template>
              </vs-tooltip>
              <vs-tooltip style="width: max-content">
                <button
                  class="rounded-full w-max-content px-1"
                  style="width: max-content;"
                  :class="!inGroup ? '' : 'bg-purple-500'"
                  @click="JoinGroup()"
                >
                  <i class="bx text-5xl" :class="!inGroup ? ' bxs-user-plus' : 'bx-group'" />
                </button>
                <template #tooltip>{{inGroup ? 'Group Member' : 'Join Group'}}</template>
              </vs-tooltip>
            </div>
          </div>
        </template>
      </VxCard>
      <div class="w-full vx-row">
        <div
          class="vx-row mb-8 w-full bg-white justify-between p-4"
          style="border-radius: 0.375rem;"
        >
          <vs-avatar class="icon-small float-right" @click="goBack()">
            <i class="bx bx-arrow-back" style="font-size: 1.25rem;" />
          </vs-avatar>
          <vs-button-group class="md:w-auto w-full">
            <vs-button transparent :active="active=='Summary'">
              <div class="text-xl px-2 text-ginger">Summary</div>
            </vs-button>
            <vs-button
              @click="pushNotes()"
              transparent
              :active="active=='Notes'"
              v-if="inGroup && group.approved"
            >
              <div class="text-xl px-2 text-ginger">Notes</div>
            </vs-button>
            <vs-button  @click="pushQuestions()" transparent :active="active=='Questions'" v-if="inGroup && group.approved">
              <div class="text-xl px-2 text-ginger">Questions</div>
            </vs-button>
          </vs-button-group>
        </div>
        <!-- Summary -->

        <div
          class="w-full md:w-2/3 p-4 md:px-8 content-input bg-white"
          style="border-radius: 0.375rem;"
        >
          <vs-button
            class="rounded-full w-max-content px-1 my-1 text-xl"
            style="width: max-content;"
            :color="!inGroup ? 'white' : '#9f7aea'"
            @click="JoinGroup()"
          >
            <div class="text-lg" style>{{inGroup ? 'Group Member' : 'Join Group'}}&nbsp;</div>
            <i class="bx text-3xl" :class="!inGroup ? ' bxs-user-plus' : 'bx-group'" />
          </vs-button>

          <div class="text-ginger-b text-xl">Description</div>
          <div class="mt-4 ml-4 text-ginger">{{group.description}}</div>
          <div class="mt-4 text-ginger">
            <b>Date Created:</b>
            {{group.createdAt.toDateString().slice(4, 10) + ',' + group.createdAt.toDateString().slice(10)}}
          </div>
          <div class="mt-4 text-ginger">
            <b>Grade:</b>
            {{group.grade}}
          </div>
          <div class="mt-4 text-ginger">
            <b>Subject:</b>
            {{group.subject}}
          </div>
          <div class="mt-4 text-ginger">
            <b>School:</b>
            {{group.school}}
          </div>

          <div class="flex flex-row items-center my-6">
            <h1 class="text-ginger-b mr-6">Join Link</h1>
            <vs-button
              @click="GenerateJoinToken()"
              class="text-ginger"
              v-if="groupOwner(AuthUser.uid)"
            >Generate Join Link</vs-button>
          </div>
          <vs-input
            class="mt-4 block"
            readonly
            style="max-width : 600px"
            icon-after
            :value="JoinToken"
            @click-icon="copyLink()"
          >
            <template #icon>
              <i class="bx bx-clipboard cursor-pointer"></i>
            </template>
          </vs-input>

          <!-- <vs-select
            filter
            class="block mb-3 w-6 mt-3 w-full lg:w-1/2"
            placeholder="School"
            v-model="schoolSelect"
          >
            <vs-option value="Any" label="Select School">
              <div class="font-bold truncate">Any</div>
            </vs-option>
            <vs-option
              v-for="(school, subIndex) in SchoolList"
              :key="subIndex"
              :label="school"
              :value="school"
            >
              <div class="font-bold truncate">{{ school }}</div>
            </vs-option>
          </vs-select>-->
        </div>

        <!-- Member List -->
        <div class="vx-row justify-center w-full md:w-1/3 md:px-6 mt-6 md:mt-0">
          <div
            class="flex flex-row w-full bg-white rounded-md lg:w-2/3"
            style="border-radius: 0.375rem;"
          >
            <div class="w-full px-8 p-4 text-ginger text-2xl">
              <span class="text-ginger-b mb-6">Members ({{group.memberList.length}}):</span>
              <div
                v-for="(user, index) in members"
                :key="index"
                class="flex flex-row items-center text-ginger text-xl my-4"
              >
                <vs-avatar
                  @click="$router.push(`/user/view/${user.id}`)"
                  class="w-12 h-12 mr-4 cursor-pointer"
                >
                  <img :src="user.photoUrl" />
                  <template #badge v-if="groupOwner(user.id)">
                    <i class="bx bx-crown text-lg"></i>
                  </template>
                </vs-avatar>
                <div class="text-title truncate w-full" style="min-width : 0">{{user.displayName}}</div>
                <div>
                  <vs-button
                    class="rounded-md w-max-content px-1"
                    style="width: max-content;"
                    icon
                    danger
                    flat
                    active
                    @click="OpenKickModal(user)"
                    v-if="showXButton(user.id)"
                  >
                    <i class="bx text-3xl text-white bx-x" />
                  </vs-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <vs-alert color="danger" v-if="docNotFound">
      <template #title>Something Went Wrong</template>
      <b>Sorry!</b> Something went wrong when fetching the Newsletter. Please Try
      Again.
    </vs-alert>
  </div>
</template>


<script lang="ts">
import {Component, Vue, Prop, mixins} from 'nuxt-property-decorator'
import UserMixin from '~/mixins/UserMixin'
import functions from '~/plugins/firebaseFunctions'
import firestore from '~/plugins/firestore'
import {Group, Group_t_F} from '~/types/groups'
import {firestore as store} from 'firebase/app'
import {groupsStore} from '~/store'

@Component<GroupsSummary>({
  components: {},
  mounted() {
    this.fetchGroup()
  }
})
export default class GroupsSummary extends mixins(UserMixin) {
  members: any[] = []
  groupId: string | null = null
  docNotFound = false
  group: Group | null = null

  kickUser: {id: string; displayName: string} = {id: '', displayName: ''}
  kickModalOpen = false
  get JoinToken() {
    if (this.group?.inviteToken) {
      const redirect_uri = window.location.origin
      return `${redirect_uri}/groups/join?token=${this.group.inviteToken}`
    }
    return ''
  }
  active: 'Questions' | 'Summary' | 'Notes' = 'Summary'

  async KickOrLeave() {
    if (!this.kickUser.id || this.kickUser.id === '' || !this.groupId) return
    const loading = this.$vs.loading()
    try {
      await firestore
        .collection('groups')
        .doc(this.groupId)
        .update({
          memberList: store.FieldValue.arrayRemove(this.kickUser.id)
        })
      await this.fetchGroup()
      if (this.kickUser.id === this.AuthUser?.uid) {
        await groupsStore.GetUserGroups()
        this.$router.push('/groups')
      }
    } catch (error) {
      console.error(error)
      this.$vs.notification({
        title: error.message,
        color: 'danger'
      })
    }
    loading.close()
  }

  get inGroup() {
    return (
      this.AuthUser?.uid && this.group?.memberList?.includes(this.AuthUser?.uid)
    )
  }

  async OpenKickModal(user: {id: string; displayName: string}) {
    this.kickUser = user
    this.kickModalOpen = true
  }
  showXButton(userId: string) {
    return (
      (this.groupOwner(this.AuthUser?.uid!) && this.AuthUser?.uid !== userId) ||
      (!this.groupOwner(this.AuthUser?.uid!) &&
        !(this.AuthUser?.uid !== userId))
    )
  }

  backgroundGradient(imageUrl: string) {
    return `background-image : linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${imageUrl}')`
  }
  goBack() {
    this.$router.push('/groups')
  }
  pushNotes() {
    this.$router.push('/groups/g/' + this.groupId + '/groupNotes')
  }
  pushQuestions(){
    this.$router.push('/groups/g/' + this.groupId+'/groupQuestions')
  }
  get memberOfGroup() {
    return (
      this.group &&
      this.AuthUser?.uid &&
      this.group.memberList.includes(this.AuthUser.uid)
    )
  }

  groupOwner(userId: string) {
    return this.group?.userId === userId
  }

  async JoinGroup() {
    if (!this.group || this.inGroup || !this.AuthUser?.uid) return
    if (!this.group?.approved) {
      this.$vs.notification({
        title: 'Group Is Not Verified, Cannot Join',
        color: 'danger'
      })
    }
    const loading = this.$vs.loading()
    try {
      await firestore
        .collection('groups')
        .doc(this.group.id)
        .update({
          memberList: store.FieldValue.arrayUnion(this.AuthUser.uid)
        })
      await this.fetchGroup()
      this.$vs.notification({
        title: 'Group Joined!',
        color: 'success'
      })
    } catch (error) {
      console.error(error)
      this.$vs.notification({
        title: error.message,
        color: 'danger'
      })
    }
    loading.close()
  }

  async GenerateJoinToken() {
    const groupId = this.groupId
    if (
      !groupId ||
      this.docNotFound ||
      !this.group ||
      !this.group.approved ||
      !this.memberOfGroup
    )
      return
    const loading = this.$vs.loading()
    const res = await functions.httpsCallable('GenerateJoinToken')({groupId})
    if (res.data.status !== 200) {
      this.$vs.notification({
        title: res.data.message,
        color: 'danger'
      })
      console.log({res})
    } else {
      this.fetchGroup()
    }
    loading.close()
  }

  copyLink() {
    const tokenEl = document.querySelector('#joinInput') as HTMLInputElement
    tokenEl.setAttribute('type', 'text')
    tokenEl.select()
    // tokenEl.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand('copy')
    this.$vs.notification({
      title: 'Link Copied to Clipboard',
      color: 'success'
    })
  }

  async fetchMembers() {
    if (!this.group) return
    const userDocs = await Promise.all(
      this.group.memberList.map((id) =>
        firestore.collection('users').doc(id).get()
      )
    )
    userDocs[0].data()
    const bruh = userDocs.map((doc) => ({...doc.data(), id: doc.id}))
    this.members = bruh
  }

  async fetchGroup() {
    //   this.group!.bac
    const loading = this.$vs.loading()
    this.groupId = this.$route.params.id
    if (!this.groupId) {
      this.$router.push('/groups')
      return
    }
    try {
      const doc = await firestore.doc(`groups/${this.groupId}`).get()
      const groupData = doc.data() as Group_t_F
      if (!groupData) {
        this.docNotFound = true
        loading.close()
        return
      }
      this.group = Group.fromFirebase(groupData, doc.id)
      await this.fetchMembers()
      loading.close()
      return
    } catch (error) {
      console.log({error})
      loading.close()
    }
  }
}
</script>