<template>
  <VxCard
    v-if="group"
    class="overlay-card mb-4 overflow-hidden cardster"
    style="border-radius: 1.28rem !important;"
  >
    <!-- Card Outside -->
    <template slot="no-body">
      <nuxt-link :to="`/groups/g/${group.id}`">
        <!-- Background -->
        <div
          class="text-white background-cover p-8 pt-4 relative"
          style="min-height : 250px"
          :style="backgroundGradient(group.backgroundImageUrl)"
        >
          <vs-tooltip style="width: max-content">
            <div
              class="rounded-full w-max-content px-1"
              style="width: max-content"
              :class="group.approved ? ' bg-green-400' : 'bg-orange-400'"
            >
              <i class="bx text-3xl" :class="group.approved ? ' bx-check' : 'bx-dots-horizontal'" />
            </div>
            <template #tooltip>{{group.approved ? 'Verified' : 'Pending Approval'}}</template>
          </vs-tooltip>
          <!-- MAIN INSIDE CARD -->
          <div
            class="mb-2 md:mt-32 font-bold w-2/3 text-white font-open text-3xl"
            style="line-height : 1.25"
          >
            {{ group.title }}
            <!--Title-->
          </div>

          <!-- Author Line -->
          <div class="flex flex-row flex-wrap md:flex-no-wrap w-2/3" style>
            <vs-tooltip class="truncate">
              <div
                :style="`background-color: #${randomColor()}`"
                style="min-width : 0"
                class="p-1 px-2 text-sm truncate rounded-full m-1"
                v-if="group.subject"
              >{{group.subject}}</div>
              <template #tooltip>{{group.subject}}</template>
            </vs-tooltip>
            <vs-tooltip class="truncate">
              <div
                :style="`background-color: #${randomColor()}`"
                style="min-width : 0"
                class="p-1 px-2 text-sm truncate rounded-full m-1"
                v-if="group.school"
              >{{group.school}}</div>
              <template #tooltip>{{group.school}}</template>
            </vs-tooltip>
            <vs-tooltip class="truncate">
              <div
                :style="`background-color: #${randomColor()}`"
                style="min-width : 0"
                class="p-1 px-2 text-sm truncate rounded-full m-1"
                v-if="group.grade"
              >Grade {{group.grade}}</div>
              <template #tooltip>Grade {{group.grade}}</template>
            </vs-tooltip>
          </div>

          <!-- Side -->
          <div
            class="sideboi rounded-r-super absolute top-0 right-0 h-full w-33% p-4 text-black font-open"
          >
            <h4 class="font-bold my-1">Description</h4>

            <p
              class="text-xs italic mb-4 mt-2"
              style="max-height:50%;overflow:hidden"
            >{{group.description}}</p>

            <h5 class="font-semibold text-md">Members</h5>
            <p class="font-light text-sm">{{group.memberList.length}}</p>
          </div>
        </div>
      </nuxt-link>
    </template>
  </VxCard>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'nuxt-property-decorator'
import {Group} from '~/types/groups'

@Component<GroupCard>({components: {}})
export default class GroupCard extends Vue {
  @Prop({required: true}) group!: Group

  backgroundGradient(imageUrl: string) {
    return `background-image : linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${imageUrl}')`
  }
  randomColor() {
    return Math.floor(Math.random() * 16777215).toString(16)
  }
}
</script>

<style lang = "scss">
.cardster {
  box-shadow: 0px 12px 15px -7px rgba(0, 0, 0, 0.27);
}
.sideboi {
  background-color: #f9f9f9;
  transition: background-color 0.8s ease-in-out;
}
.cardster:hover {
  box-shadow: 0px 19px 37px 3px rgba(0, 0, 0, 0.21);
  .sideboi {
    background-color: white;
    box-shadow: 0px 10px 34px 0px rgba(0, 0, 0, 0.42);
    transition: box-shadow 0.3s ease-in-out;
  }
}
</style>