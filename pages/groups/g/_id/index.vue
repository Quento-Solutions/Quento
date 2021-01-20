<template>
  <div id="newsletter-content-container" class="w-full">
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
      <!-- Summary -->

      <div
        class="w-full md:w-2/3 p-4 md:px-8 content-input bg-white"
        style="border-radius: 0.375rem;"
      >
        <vs-button
          class="rounded-full w-max-content px-1 my-1 text-xl"
          style="width: max-content;"
          :color="!inGroup ? 'white' : '#9f7aea'"
          @click="$emit('join')"
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
import firebase from 'firebase'
import {Group, Group_t_F} from '~/types/groups'

//WHICH PERSON WROTE THIS I CRIED
// import {firestore as store} from 'firebase/app'

import {groupsStore} from '~/store'

@Component<GroupsSummary>({
  components: {},
  mounted() {}
})
export default class GroupsSummary extends mixins(UserMixin) {

  @Prop({required: true}) group!: Group
  @Prop({required: true, type: Array}) members!: any[]
  @Prop({required: true, type: String}) groupId!: string

  kickUser: {id: string; displayName: string} = {id: '', displayName: ''}
  kickModalOpen = false
  get JoinToken() {
    if (this.group?.inviteToken) {
      const redirect_uri = window.location.origin
      return `${redirect_uri}/groups/join?token=${this.group.inviteToken}`
    }
    return ''
  }

  async KickOrLeave() {
    if (!this.kickUser.id || this.kickUser.id === '' || !this.groupId) return
    const loading = this.$vs.loading()
    try {
      await firestore
        .collection('groups')
        .doc(this.groupId)
        .update({
          memberList: firebase.firestore.FieldValue.arrayRemove(this.kickUser.id)
        })
        this.$emit('refetch');
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


  async GenerateJoinToken() {
    const groupId = this.groupId
    if (
      !groupId ||
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
      this.$emit('refetch');
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
}
</script>