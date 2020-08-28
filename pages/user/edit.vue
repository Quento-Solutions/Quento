<template>
  <div id="user-profile-view">
    <input
      type="file"
      class="hidden"
      ref="imageUpload"
      accept="image/png, image/jpeg"
      @change="fileUploaded()"
    />
    <div id="user-view">
      <!-- Profile Card -->
      <VxCard class="mb-base" v-if="AuthUser && UserData && UserInfo">
        <!-- Avatar -->

        <div class="vx-row w-full" style>
          <div class="vx-row w-full lg:w-1/2">
            <!-- Avatar Col -->
            <div class="vx-col" id="avatar-col">
              <div class="img-container mb-4 container2" id="fullImage">
                <img
                  :src="UserInfo.photoURL"
                  class="rounded-lg w-full"
                  id="changePhoto"
                  style="width:11rem; height:8rem; overflow:hidden"
                  @click="imageUploadClick()"
                />
              </div>
            </div>

            <!-- Information - Col 1 -->
            <div class="vx-col flex-1 w-full md:text-lg text-2xl" id="account-info-col-1">
              <vs-input v-model="UserInfo.displayName" state="dark" />
              <div class="w-full vx-row p-2 items-center text-lg mt-2" style>
                Grade
                <vs-select
                  v-model="UserInfo.currentGrade"
                  style="margin-left:0.5rem; max-width:4.75rem; margin-right:0.5rem"
                  state="dark"
                  id="gradeBreakLine"
                >
                  <!-- <option selected>Select School</option> -->
                  <vs-option
                    v-for="(item, index) in ['9','10','11','12']"
                    :key="index"
                    :label="item"
                    :value="item"
                    class="pb-4"
                  >{{item}}</vs-option>
                </vs-select>at
                <vs-select
                  v-model="UserInfo.school"
                  style="min-width:15.5rem;margin-left:0.75rem"
                  state="dark"
                >
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
            </div>

            <div class="w-full vx-row p-2 items-center text-sm">
              <div
                class="rounded-full px-3 py-2 vx-row items-center text-ginger text-white mx-2 my-1"
                :style="`background-color: #9745D4`"
                v-for="(subject, index) in UserInfo.interestedSubjects"
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
              <div
                class="rounded-full px-3 py-2 vx-row items-center text-ginger text-white mx-2 my-1"
                style="background-color:#46C93A"
              >
                <i
                  class="bx bx-plus-circle text-xl text-white mr-2"
                  id="remove_icon"
                  @click="activateModal()"
                />

                <!-- Modal for selecting un-selected subjects -->
                <vs-dialog v-model="subjectModalActive">
                  <template #header>
                    <h4 class="not-margin">
                      <b>
                        Add new
                        Subjects
                      </b>
                    </h4>
                  </template>

                  <div>
                    <vs-checkbox
                      :val="subject"
                      v-for="(subject,index) in AllSubjectList"
                      :key="index"
                      v-model="UserInfo.interestedSubjects"
                    >{{ subject }}</vs-checkbox>
                  </div>
                </vs-dialog>
              </div>
            </div>
            <div class="w-full p-2 md:px-8" style>
              <div
                class="p-2 mb-2 rounded-lg border-solid border-gray-400 w-full text-2xl font-semibold"
              >Biography</div>
              <vs-textarea v-model="UserInfo.bio" class="my-2"></vs-textarea>
              <vs-checkbox v-model="UserInfo.notifications" class="my-2">Enable Notifications</vs-checkbox>
              <vs-button
                color="success"
                type="filled"
                size="large"
                @click="saveChanges()"
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
  SubjectOptions,
  AllSubjectList
} from '~/types/subjects'

import NotesCard from '~/components/NotesCard.vue'
import { Note_t, Note, Note_t_F } from '~/types/notes'
import { School_O, SchoolList } from '~/types/schools'
import SubjectsDropdown from '~/components/SubjectsDropdown.vue'
import { firebaseAuth, GoogleAuthProvider } from '~/plugins/firebase'
import { UserData } from '~/types/user'
import { authStore } from '~/store'
import ValidateImageMixin from '~/mixins/ValidateImageMixin'
import functions from '~/plugins/firebaseFunctions'
import storage from '~/plugins/firebaseStorage'

@Component<UserSettings>({
  components: {
    NotesCard,
    SubjectsDropdown
  },
  mounted() {
    this.cloneUserInfo();
    this.getUserNotes()
  }
})
export default class UserSettings extends mixins(
  UserMixin,
  ValidateImageMixin
) {
  UserNotes: Note[] = []
  SubjectDict = Object.assign({}, SubjectOptions)
  SchoolList = [...SchoolList]
  newImageUpload = false
  subjectModalActive = false
  AllSubjectList = [...AllSubjectList]

  UserInfo: Partial<UserData> | null = null


  cloneUserInfo()
  {
    if(!this.UserData) return;
    this.UserInfo = JSON.parse(JSON.stringify({ notifications : false, ...this.UserData }))
  }
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

  @Watch('UserData')
  onUserData(value: any, oldValue: any) {
    this.cloneUserInfo();
    this.newImageUpload = false
    ;(this.$refs.imageUpload as HTMLInputElement).files = null
  }

  @Watch('AuthUser')
  onAuthChange(value: any, oldValue: any) {
    if (value) {
      this.getUserNotes()
    }
  }

  async fileUploaded() {
    const files = (this.$refs.imageUpload as HTMLInputElement)?.files
    if (!files) return
    const imageFile = files[0]
    if (!imageFile) return
    if (!this.validateImageType(imageFile)) return

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (!this.UserInfo) return

      const base64Image = reader.result
      this.UserInfo.photoURL = base64Image as string
      this.newImageUpload = true
    })
    reader.readAsDataURL(imageFile)
  }

  imageUploadClick() {
    ;(this.$refs.imageUpload as HTMLInputElement).click()
    return
  }

  getIcon(subject: SubjectGroup_O | Subject_O) {
    return SubjectIconList[subject]
  }
  randomColor() {
    return Math.floor(Math.random() * 16777215).toString(16)
  }

  removeSubject(subject: Subject_O) {
    if (!this.UserInfo) return
    this.UserInfo.interestedSubjects = this.UserInfo.interestedSubjects?.filter(
      (value) => value != subject
    )
  }

  activateModal() {
    this.subjectModalActive = true
  }

  async saveChanges() {
    if (!this.UserInfo) return
    const loading = this.$vs.loading({
      text: 'Processing Changes',
      type: 'circles'
    })

    try {
      if (this.newImageUpload) {
        const base64image = this.UserInfo.photoURL

        const newImageUrl = await functions.httpsCallable('functionPostImage')({
          image: base64image,
          name: 'bruh'
        })
        if (this.UserInfo?.photoFileName) {
          await storage.ref(this.UserInfo.photoFileName).delete()
        }
        this.UserInfo.photoURL = newImageUrl.data.imageURL
        this.UserInfo.photoFileName = newImageUrl.data.fileName as string
      }

      await authStore.updateUserData(this.UserInfo);
      this.$vs.notification({
        title: 'Changes Saved',
        color: 'success'
      })
    } catch (error) {
      this.$vs.notification({
        title: 'An Error Occured',
        color: 'warn'
      })
    }
    loading.close()
    this.$router.push('/user/profile')
  }
}
</script>
<style lang="scss">
#avatar-col {
  width: 10rem;
}

#changePhoto:hover {
  cursor: pointer;
  filter: brightness(50%);
}

#changePhoto:hover ~ #pencilImage {
  filter: opacity(100);
}

#pencilImage:hover {
  filter: opacity(100);
  cursor: pointer;
}

#pencilImage {
  filter: opacity(0);
}

#pencilImage:hover ~ #changePhoto {
  filter: brightness(20%);
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
    margin-bottom: 0.8rem;
  }
}
</style>
