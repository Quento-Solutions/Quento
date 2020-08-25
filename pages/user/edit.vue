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
              <div class="img-container mb-4 container2">
                <img :src="UserData.photoURL" class="rounded-lg w-full" id="changePhoto" />
                <i
                  class="bx bx-pencil"
                  id="pencilImage"
                  style="position:absolute;top:3.4rem;left:4.6rem;z-index:1000;color:white;font-size:4rem"
                ></i>
              </div>
            </div>

            <!-- Information - Col 1 -->
            <div class="vx-col flex-1 w-full md:text-lg text-2xl" id="account-info-col-1">
              <vs-input v-model="value" state="dark" :placeholder="UserData.displayName" />
              <div class="w-full vx-row p-2 items-center text-lg mt-2" style>
                Grade
                <form
                  style="background-color: #E8E8E8; margin-left:0.5rem; margin-right:0.5rem; width: 6.5rem;
                  font-size: 0.7rem; height: 2rem; text-align: center; align-items: center; overflow:hidden;
                  border-radius: 0.6rem;
                  "
                  id="gradeBreakLine"
                >
                  <select
                    style="-webkit-appearance: menulist; color: #B2B2B2;vertical-align: middle; margin-top:0.5rem;"
                    value="school"
                  >
                    <option selected>Select Grade</option>
                    <option>9</option>
                    <option>10</option>
                    <option>11</option>
                    <option>12</option>
                  </select>
                </form>at
                <vs-select v-model="ActiveSchool" style="background-color: #E8E8E8;">
                  <!-- <option selected>Select School</option> -->
                  <vs-option
                    v-for="(item, index) in SchoolList"
                    :key="index"
                    :label="item"
                    :value="item"
                    class="pb-4"
                  >{{item}}</vs-option>
                </vs-select>
              </div>

              <div class="vx-row w-full my-2 items-center">
                <div class="font-bold text-xl mr-2 text-green">Level</div>
                <vs-avatar warn size="25">
                  <div class="font-bold text-base">{{userLevel}}</div>
                </vs-avatar>
              </div>

              <!-- MAKE A PROGRESSION BAR  -->
              <!-- <div class="vx-row w-full mt-6">
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
              </div>-->
            </div>

            <!-- <div class="text-title w-full vx-col text-2xl px-10" style="">
              Subjects
            </div>-->
            <div class="w-full vx-row p-2 items-center text-sm">
              <div
                class="rounded-full px-3 py-2 vx-row items-center text-ginger text-white mx-2 my-1"
                :style="`background-color: #${randomColor()}`"
                v-for="(subject, index) in ActiveSubjectList"
                :key="index"
              >
                <i class="bx text-xl text-white mr-2" :class="getIcon(subject)" />
                {{ subject }}
                <i
                  class="bx bx-x-circle text-xl text-white mr-2"
                  id="remove_icon"
                  @click="removeSubject(subject)"
                />
              </div>
            </div>
            <div class="w-full p-2 md:px-8" style>
              <div
                class="p-2 mb-2 rounded-lg border-solid border-gray-400 w-full text-2xl font-semibold"
              >Biography</div>
              <v-textarea filled :placeholder="UserData.bio"></v-textarea>
              <vs-button
                color="success"
                type="filled"
                size="large"
                @click="saveChanges('Vonesh')"
              >Save Changes</vs-button>
            </div>
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

import {
  SubjectGroup_O,
  Subject_O,
  SubjectIconList,
  SubjectOptions
} from '~/types/subjects'
import NotesCard from '~/components/NotesCard.vue'
import { Note_t, Note, Note_t_F } from '~/types/notes'
import { School_O, SchoolList } from '~/types/schools'
import SubjectsDropdown from '~/components/SubjectsDropdown.vue'
import { firebaseAuth, GoogleAuthProvider } from '~/plugins/firebase'
import { UserData } from '~/types/user'
import { authStore } from '~/store'

@Component<UserProfile>({
  components: {
    NotesCard,
    SubjectsDropdown
  },
  mounted() {
    this.getUserNotes()
    this.loadSchools()
    this.ActiveSubjectList = [...this.UserData?.interestedSubjects!]
    this.ActiveSchool = this.UserData?.school!
    // this.UserData?.interestedSubjects!.forEach((element) => {
    //   this.SubjectDict[element] = true
    // })
    // console.log(contentss)
    // console.log(this.UserNotes)
  }
})
export default class UserProfile extends mixins(UserMixin) {
  UserNotes: Note[] = []
  SubjectDict = Object.assign({}, SubjectOptions)
  ActiveSubjectList: Subject_O[] = []
  SchoolList = [...SchoolList]
  ActiveSchool: string | null = ''

  UserInfo: Partial<UserData> = {}

  loadSchools() {
    var contentss = '<option selected>Select School</option>'
    for (var i = 0; i < SchoolList.length; i++) {
      contentss +=
        "<option value='" + SchoolList[i] + "'>" + SchoolList[i] + '</option>'
    }
    // document.getElementById('states').innerHTML = contents
  }

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
    console.log(this.UserData?.progressionExp)
    return (this.UserData?.progressionExp || 0) / 200
  }

  getIcon(subject: SubjectGroup_O | Subject_O) {
    return SubjectIconList[subject]
  }
  randomColor() {
    return Math.floor(Math.random() * 16777215).toString(16)
  }

  removeSubject(subject: Subject_O) {
    this.ActiveSubjectList = this.ActiveSubjectList.filter(
      (value) => value != subject
    )
  }

  async saveChanges(userName: string) {
    const loading = this.$vs.loading()

    try {
      const newUserData: Partial<UserData> = {
        displayName: userName
      }
      await authStore.updateUserData(newUserData)
      this.$vs.notification({
        title: 'Changes Saved',
        color: 'success'
      })
    } catch (error) {
      // notify
    }
    loading.close()
  }
}
</script>
<style lang="scss">
#avatar-col {
  width: 10rem;
}

#changePhoto {
  filter: brightness(50%);
}

#changePhoto:hover {
  cursor: pointer;
}

#pencilImage:hover {
  cursor: pointer;
}

#remove_icon {
  margin-left: 0.4rem;
  color: white;
}

#remove_icon:hover {
  color: black;
  cursor: pointer;
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

@media only screen and (max-width: 600px) {
  #gradeBreakLine {
    margin-bottom: 1rem;
  }
}
</style>
