<template>
  <div id="user-profile-view">
    <div id="user-view">
      <VxCard class="mb-base" v-if="AuthUser && UserData">
        <!-- Avatar -->
        <!-- <div class="vx-row w-full justify-center p-2 font-bold" style>
          <div class="vx-col flex-1 text-2xl font-bold" id="account-info-col-1">My Profile</div>
        </div>-->
        <div class="vx-row w-full" style="">
          <div class="vx-row w-full lg:w-1/2">
            <!-- Avatar Col -->
            <div class="vx-col" id="avatar-col">
              <div class="img-container mb-4">
                <img :src="AuthUser.photoURL" class="rounded-lg w-full" />
              </div>
            </div>

            <!-- Information - Col 1 -->
            <div class="vx-col flex-1 w-full" id="account-info-col-1">
              <div class="vx-row font-bold text-2xl" style>
                {{ AuthUser.displayName }}
              </div>
              <div class="vx-row w-full" style>
                Grade {{ UserData.currentGrade }} at {{ UserData.school }}
              </div>

              <div class="vx-row w-full my-2 items-center">
                <div class="font-bold text-xl mr-2 text-ginger">Level</div>
                <vs-avatar warn size="25">
                  <div class="font-bold">3</div>
                </vs-avatar>
                <!-- MAKE A PROGRESSION BAR  -->
              </div>
            </div>
            <!-- <div class="text-title w-full vx-col text-2xl px-10" style="">
              Subjects
            </div> -->
            <div class="w-full vx-row p-2 items-center text-sm">
              <div
                class="rounded-full px-4 py-2 vx-row items-center text-ginger text-white mx-2 my-1"
                :style="`background-color: #${randomColor()}`"
                v-for="(subject, index) in UserData.interestedSubjects"
                :key="index"
              >
                <i
                  class="bx text-xl text-white mr-2"
                  :class="getIcon(subject)"
                />
                {{ subject }}
              </div>
            </div>
            <div class="w-full p-2 md:px-8" style="">
              <div class="p-2 rounded-lg border-solid border-gray-400 w-full font-medium">
                {{ UserData.bio }}
              </div>
            </div>
          </div>
          <!-- /Information - Col 1 -->

          <!-- Information - Col 2 -->
          <div class="vx-row w-full lg:w-1/2" style="">
            <div class="vx-col w-full" style="">

            </div>
          </div>
          <!-- /Information - Col 2 -->
          <div class="vx-col w-full flex" id="account-manage-buttons">
            <vs-button class="mr-4" size="large">
              <i class="bx bx-edit" />&nbsp; Edit
            </vs-button>
            <vs-button type="border" color="danger" size="large">
              <i class="bx bx-trash" />&nbsp; Delete
            </vs-button>
          </div>
        </div>
      </VxCard>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, mixins } from 'nuxt-property-decorator'
import UserMixin from '~/mixins/UserMixin'
import firestore from '~/plugins/firestore';

import { SubjectGroup_O, Subject_O, SubjectIconList } from '~/types/subjects'
import NotesCard from '~/components/NotesCard.vue';
import { Note_t, Note, Note_t_F } from '~/types/notes';
@Component<UserProfile>({ components: {
    NotesCard
}})
export default class UserProfile extends mixins(UserMixin) {
    UserNotes : Note[] = [];
    async getUserNotes() 
    {
        const userId = this.AuthUser?.uid;
        const notesCollection = await firestore.collection('notes').where("uid", '==', userId).get();
        this.UserNotes = notesCollection.docs.map(doc => Note.fromFirebase(doc.data() as Note_t_F));
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
