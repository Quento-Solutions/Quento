<template>
  <div>
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
            <div class style="display: flex">
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
          <vs-avatar class="icon-small float-right" @click="$router.push('/groups')">
            <i class="bx bx-arrow-back" style="font-size: 1.25rem;" />
          </vs-avatar>
          <vs-button-group class="md:w-auto w-full">
            <vs-button transparent :active="active=='Summary'" @click="active='Summary'">
              <div class="text-xl px-2 text-ginger">Summary</div>
            </vs-button>
            <vs-button
              @click="active = 'notes'"
              transparent
              :active="active=='notes'"
              v-if="inGroup && group.approved"
            >
              <div class="text-xl px-2 text-ginger">Notes</div>
            </vs-button>
            <vs-button
              @click="active='questions'"
              transparent
              :active="active=='questions'"
              v-if="inGroup && group.approved"
            >
              <div class="text-xl px-2 text-ginger">Questions</div>
            </vs-button>
          </vs-button-group>
        </div>
      </div>
      <nuxt-child
        :group="group"
        :members="members"
        :groupId="groupId"
        @join="JoinGroup()"
        @refetch="fetchGroup()"
      ></nuxt-child>
    </div>
    <vs-alert color="danger" v-if="docNotFound">
      <template #title>Something Went Wrong</template>
      <b>Sorry!</b> Something went wrong when fetching the Group. Please Try
      Again.
    </vs-alert>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop, Watch, mixins} from 'nuxt-property-decorator'
import UserMixin from '~/mixins/UserMixin'
import firebase from 'firebase'
import firestore from '~/plugins/firestore'
import {Group, Group_t_F} from '~/types/groups'
import {groupsStore} from '~/store'


// import {firestore as store} from 'firebase/app'


@Component<GroupsGroup>({
  components: {},
  mounted() {
    this.onGroupUrlChange()
  }
})
export default class GroupsGroup extends mixins(UserMixin) {
  groupId: string | null = null
  docNotFound = false
  group: Group | null = null
  members: any[] = []

  checkRoute() 
  {
    if (!this.inGroup && this.active !== 'Summary') this.active = 'Summary'
  }

  get active() {
    if (this.$route.matched.some((val) => val.name === 'groups/g/id/notes'))
      return 'notes'
    if (this.$route.matched.some((val) => val.name === 'groups/g/id/questions'))
      return 'questions'
    return 'Summary'
  }
  set active(val: 'notes' | 'questions' | 'Summary') {
    if (val === 'Summary') {
      this.$router.push(`/groups/g/${this.groupId}/`)
      return
    }
    this.$router.push(`/groups/g/${this.groupId}/${val}`)
  }

  backgroundGradient(imageUrl: string) {
    return `background-image : linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${imageUrl}')`
  }
  get groupUrl() {
    return this.$route.params.id
  }

  @Watch('groupUrl')
  onGroupUrlChange(oldVal ?: string, newVal ?: string) {
    this.fetchGroup()
  }

  get inGroup() {
    return (
      this.AuthUser?.uid && this.group?.memberList?.includes(this.AuthUser?.uid)
    )
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
          memberList: firebase.firestore.FieldValue.arrayUnion(this.AuthUser.uid)
        })
      await Promise.all([this.fetchGroup(), groupsStore.GetUserGroups()])

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
  async fetchGroup() {
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
}
</script>