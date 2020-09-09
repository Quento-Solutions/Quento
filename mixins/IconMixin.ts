import {Component, Vue} from 'nuxt-property-decorator'
import {SubjectGroup_O, SubjectIconList, Subject_O} from '~/types/subjects'

@Component<IconMixin>({})
export default class IconMixin extends Vue {
  getIcon(subject: SubjectGroup_O | Subject_O) {
    return SubjectIconList[subject]
  }
}
