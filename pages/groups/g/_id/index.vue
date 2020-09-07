<template>
  <div v-if="group">
    <vs-avatar class="icon-small" @click="goBack()">
        <i class="bx bx-arrow-back cursor-pointer" style="font-size: 1.25rem;" />
    </vs-avatar>

    <!-- Header -->
    <div>
      <h1 class = "inline block">{{group.title}}</h1>
      <div class = "absolute right-0 inline-block"> <!-- Button Container -->
        <vs-button circle flat success animation-type="vertical" class=" inline-block float-right mr-10" @click="ToggleGroupsModal(true)">
          <div class="text-lg font-ginger-b">Create/Join by Link</div>
          <template #animate>
            <i class="bx bx-plus text-2xl"></i>
          </template>
        </vs-button>
      </div>
    </div>

    <!-- GRID -->
    <div class="grid grid-cols-3" style="column-gap: 1.5rem;row-gap: 1rem;">
      <!-- MAIN SCREEN -->
      <div class = "h-full w-full bg-gray-300 col-span-2 row-span-3 p-4">
        <div id="selectors" class = "text-xl cursor-pointer grid grid-cols-3 w-50% text-center relative">
          <div>Summary</div>
          <div @click="pushNotes()">Notes</div>
          <div>Questions</div>
          <div class = "underbar" />
        </div>
      </div>

      <!-- Side Screens -->
      <div class = "h-32 w-full bg-gray-500 col-start-3 p-4">
        <h1>Description</h1>
      </div>
      <div class = "h-32 w-full bg-gray-500 col-start-3 p-4" >
        <h1>Admins</h1>
      </div>
      <div class = "h-32 w-full bg-gray-500 col-start-3 p-4" >
        <h1>Members</h1>
        <vs-avatar-group max="7">
          <vs-avatar v-for="(person, index) in allUserData" :key="index">
            <img :src="person.photoURL" alt="Avatar">
          </vs-avatar>
        </vs-avatar-group>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
  import {Component, Vue, Prop, mixins} from 'nuxt-property-decorator'
  import UserMixin from '~/mixins/UserMixin'
  import functions from '~/plugins/firebaseFunctions'
  import firestore from '~/plugins/firestore'
  import {Group, Group_t_F} from '~/types/groups'
  import { UserData } from '~/types/user'

  @Component<GroupsSummary>({
    components: {},
    async mounted() {
      await this.fetchGroup()
      await this.getUsersData()
      console.log(this.allUserData)
    
    }
  })


  export default class GroupsSummary extends mixins(UserMixin) {
    groupId: string | null = null
    docNotFound = false
    group: Group | null = null
    allUserData: UserData[] | [] = []
    
    get JoinToken() {
      if (this.group?.inviteToken) {
        const redirect_uri = window.location.origin
        return `${redirect_uri}/groups/join?token=${this.group.inviteToken}`
      }
      return ''
    }

    active: 'Questions' | 'Summary' | 'Notes' = 'Summary'

    backgroundGradient(imageUrl: string) {
      return `background-image : linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${imageUrl}')`
    }

    //For going back to the page we came from
    goBack() {
      this.$router.push('/groups')
    }
    //Go To Notes
    pushNotes(){
      this.$router.push('/groups/g/' + this.groupId+'/groupNotes')
    }

    get memberOfGroup() {
      return (
        this.group &&
        this.AuthUser?.uid &&
        this.group.memberList.includes(this.AuthUser.uid)
      )
    }
    
    //Make link to join group
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
    //Force copy the link
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

    async fetchGroup() {
      //   this.group!.bac
      const loading = this.$vs.loading()
      this.groupId = this.$route.params.id

      //Get out if the group id is not
      if (!this.groupId) {
        this.$router.push('/groups')
        return
      }

      

      //Hello mr.firebase
      try {
        const doc = await firestore.doc(`groups/${this.groupId}`).get()
        const groupData = doc.data() as Group_t_F
        //If not found
        if (!groupData) {
          this.docNotFound = true
          loading.close()
          return
        }
        //ASSIGN THIS.GROUP
        this.group = Group.fromFirebase(groupData, doc.id)
        loading.close()
        return
      } 
      catch (error) {
        console.log({error})
        loading.close()
      }
    }

    async getUsersData() {
      const loading = this.$vs.loading()
      
      // const a = this.group?.memberList.map(query_id => {
      //     const doc = await firestore.collection('users').doc(query_id as string).get()
      //     const userData = doc.data() as UserData
      //   }
      // )
      
      if(!this.group?.memberList.length){
        return
      }

      var a = []
      for (var i = 0; i < this.group?.memberList.length; i++) {
        const query_id = this.group?.memberList[i]
        const doc = await firestore.collection('users').doc(query_id as string).get()
        const userData = doc.data() as UserData
        a.push(userData)
      }
      this.allUserData = a 

      loading.close()
    }

    async fetchUser(userID:string){
      const loading = this.$vs.loading()
      try{
        const doc = await firestore.doc(`users/${userID}`).get()
        const userData = doc.data() as UserData
        if(!userData){
          loading.close()
          return
        }

        this.allUserData.push() 
        loading.close()
        return
      }
      catch (error) {
        console.log({error})
        loading.close()
      }
    }
  }
</script>

<style scoped lang="scss">
  #background-imagery{
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: -1;

    background-image:url('${group.backgroundImageUrl}');
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  
  .underbar{
    width: 0;
    height: 5px;
    background: rgba(100,100,200,0);
    //left: -50px;
    top: 25px;
    position: absolute;
    transition: 0.5s ease;
  }
  #selectors div{
    $underbarWidth:15%;
    $extra:(33%-$underbarWidth)/2;
    $extra-2:33%+$extra;
    $extra-3:66%+$extra;
    $underlineColor:#195BFF;
    left:$extra;
    &:nth-of-type(1):hover ~ .underbar{
      left: $extra;
      width: $underbarWidth;
      background: $underlineColor;
    }
    &:nth-of-type(2):hover ~ .underbar{
      left: $extra-2; 
      width: $underbarWidth;
      background: $underlineColor;
    }
    &:nth-of-type(3):hover ~ .underbar{
      left: $extra-3;
      width: $underbarWidth;
      background: $underlineColor;
    }
  }
</style>