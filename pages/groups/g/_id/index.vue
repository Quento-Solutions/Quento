<template>
  <div id="newsletter-content-container">
          <input type="text" :value='JoinToken' id="joinInput" style="position : absolute; z-index : -10000000"/>

    <div class="vx-row justify-center w-full" v-if="group">
      <VxCard class="mb-6 w-24 min-w-full" style="border-radius: 0.8rem;">
        <template slot="no-body">
          <div
            class="text-white flex flex-col background-cover p-4 md:p-8 w-full"
            :style="backgroundGradient(group.backgroundImageUrl)"
            style="min-height: 20vw;border-radius: 0.6rem;"
          >
            <input
              class="text-white text-title text-6xl font-medium"
              style="line-height: 1.125;"
              :readonly="true"
              v-model="group.title"
            />
          </div>
        </template>
      </VxCard>
      <div class="w-full vx-row">
        <div class="vx-row mb-8 w-full bg-white justify-between p-4 pr-24 pl-12" style="border-radius: 0.375rem;">
          <vs-avatar class="icon-small float-right" @click="goBack()">
            <i class="bx bx-arrow-back" style="font-size: 1.25rem;" />
          </vs-avatar>
          <vs-button-group>
            <vs-button transparent :active="active=='Summary'">
              <div class="text-xl px-2 text-ginger">Summary</div>
            </vs-button>
            <vs-button @click="pushNotes()" transparent :active="active=='Notes'">
              <div class="text-xl px-2 text-ginger">Notes</div>
            </vs-button>
            <vs-button @click="pushQuestions()" transparent :active="active=='Questions'">
              <div class="text-xl px-2 text-ginger">Questions</div>
            </vs-button>
          </vs-button-group>
        </div>
        <!-- Summary -->

        <div class="w-full md:w-2/3 p-4 md:px-8 content-input bg-white" style="border-radius: 0.375rem;">
          <h1 class="text-ginger-b">Description</h1>
          <div class="mt-4 text-ginger">{{group.description}}</div>
          <div class="mt-4 text-ginger"><b>Date Created:</b> {{group.createdAt.toDateString().slice(4, 10) + ',' + group.createdAt.toDateString().slice(10)}}</div>
          <div class="mt-4 text-ginger"><b>Grade:</b> {{group.grade}}</div>
          <div class="mt-4 text-ginger"><b>Subject:</b> {{group.subject}}</div>
          <div class="mt-4 text-ginger"><b>School:</b> {{group.school}}</div>
          <div class="flex flex-row items-center my-6">
          <h1 class="text-ginger-b mr-6">Join Link</h1><vs-button @click="GenerateJoinToken()" class="text-ginger">Generate Join Link</vs-button></div>
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
          </vs-select> -->
        </div>

        <!-- Member List -->
        <div class="vx-row justify-center w-full md:w-1/3">
          <div class="vx-row w-full bg-white rounded-md lg:w-2/3" style="border-radius: 0.375rem;">
            <div class="w-full pl-6 p-4 pt-4 pb-2 text-ginger text-2xl"><span class="text-ginger-b mb-6">Members ({{group.memberList.length}}):</span>
            <div v-for="(user, index) in members" :key="index" class="flex flex-row items-center text-ginger text-xl my-4">
              <img :src="user.photoUrl" class="w-12 h-12 mr-4" style="border-radius:0.5rem;">{{user.displayName}}
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

@Component<GroupsSummary>({
  components: {},
  mounted() {
    this.fetchGroup()
  }
})
export default class GroupsSummary extends mixins(UserMixin) {
  members: any[] = [];
  groupId: string | null = null
  docNotFound = false
  group: Group | null = null
  get JoinToken() {
    if (this.group?.inviteToken) {
      const redirect_uri = window.location.origin
      return `${redirect_uri}/groups/join?token=${this.group.inviteToken}`
    }
    return ''
  }
  active: 'Questions' | 'Summary' | 'Notes' = 'Summary'

  backgroundGradient(imageUrl: string) {
    this.fetchMembers()
    return `background-image : linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${imageUrl}')`
  }
  goBack() {
    this.$router.push('/groups')
  }
  pushNotes(){
    this.$router.push('/groups/g/' + this.groupId+'/groupNotes')
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

  copyLink()
  {
    const tokenEl = (document.querySelector('#joinInput')) as HTMLInputElement;
    console.log({tokenEl})
    tokenEl.setAttribute('type', 'text')
    tokenEl.select();
    // tokenEl.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand('copy');
    this.$vs.notification({
      title : 'Link Copied to Clipboard',
      color : "success"
    })
  }

  async fetchMembers() {
    const userDocs = await Promise.all(this.group.memberList.map(id => firestore.collection('users').doc(id).get()))
    userDocs[0].data()
    const bruh = userDocs.map(doc => doc.data())
// console.log(bruh[0].displayName)
    this.members = bruh 
// const userData = userDocs.map(doc => ...doc.data(), id : doc.id})
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
      loading.close()
      return
    } catch (error) {
      console.log({error})
      loading.close()
    }
  }
  
}
</script>