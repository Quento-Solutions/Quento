<template>
  <div>
    <vs-sidebar-group
      color="#9331e1"
      v-for="(subjectGroup, groupIndex) in SubjectGroups"
      :key="groupIndex + 4"
    >
      <template #header>
        <vs-sidebar-item arrow>
          <div class="vx-row w-full">
            <!-- <vs-button /> -->
            <i class="bx text-3xl" :class="subjectGroup.iconClass" />
            <div class="font-bold truncate ml-4">
              {{ subjectGroup.name }}
            </div>
          </div>
        </vs-sidebar-item>
      </template>

      <vs-sidebar-item
        v-for="(subject, index) in subjectGroup.items"
        :key="index"
      >
        <vs-checkbox
          color="#4D7C8A"
          v-model="SubjectOptions[subject.name]"
          @click="subjectClicked(subject.name)"
        >
          <i class="bx text-3xl mr-2" :class="subject.iconClass" />
          <div class="font-bold truncate">
            {{ subject.name }}
          </div>
        </vs-checkbox>
      </vs-sidebar-item>
    </vs-sidebar-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, PropSync } from 'nuxt-property-decorator'

import {
  GradeList,
  SubjectGroup_O,
  SubjectList,
  SubjectIconList,
  Subject_O,
  NestedSubjectList,
  SubjectOptions
} from '~/types/subjects'

@Component<SubjectsDropdown>({ components: {} })
export default class SubjectsDropdown extends Vue {
    @PropSync('value', {type : Object}) SubjectOptions !: typeof SubjectOptions;
    @PropSync('list', { type : Array}) ActiveSubjectList !: Subject_O[];
    @Prop({default : false}) clearValues !: boolean;


    SubjectGroups = NestedSubjectList;
    subjectClicked(
        name: Subject_O,
    ) {
        const findIndex = this.ActiveSubjectList.indexOf(name)

        if (findIndex === -1) {
        this.ActiveSubjectList.unshift(name)
        if (this.ActiveSubjectList.length > 10) {
            const removedSubject = this.ActiveSubjectList.pop()!
            this.SubjectOptions[removedSubject] = false
        }
        } else {
            this.ActiveSubjectList.splice(findIndex,1);
        }
    }
}
</script>
