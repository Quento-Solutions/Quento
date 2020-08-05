


export const SubjectGroups = {
  Sciences: ['Physics', 'Chemistry', 'Biology', 'Math'],
  Languages: ['English', 'French', 'Spanish'],
  Arts: ['Visual Arts', 'Music', 'Dance', 'Drama', 'Film'],
  'Social Sciences': ['TOK', 'Geography', 'History', 'Business'],
  Technology: ['ICS', 'ITGS', 'ComTech']
} as const

export type SubjectGroup_O = keyof typeof SubjectGroups;
export const GradeList = [9,10,11,12] as const;
export type Grade_O = typeof GradeList[number];
export const SubjectList = Object.entries(SubjectGroups).flatMap(
  (group) => group[1]
)

export type Subject_O = typeof SubjectList[number]

export const SubjectIconList : 
{
    [index in Subject_O | SubjectGroup_O] : string;
} = 
{
    Sciences : 'bxs-magic-wand',
    Languages : 'bxl-audible',
    Arts : 'bx-palette',
    "Social Sciences" : 'bx-group',
    Technology : 'bx-laptop',

    Math : 'bx-brain',
    'Physics' : 'bx-atom',
    Chemistry : 'bx-bong',
    Biology : 'bx-hive',
    'English' : 'bx-book-bookmark',
    French : 'bxs-map-alt',
    'Spanish' : 'bx-church',
    "Visual Arts" : 'bx-brush',
    Music : 'bx-music',
    Dance : 'bxs-guitar-amp',
    Drama : 'bxs-user-voice',
    Film : 'bx-camera-movie',
    TOK : 'bx-network-chart',
    'Geography' : 'bx-landscape',
    History : 'bxs-landmark',
    Business : 'bx-briefcase',
    ICS : 'bx-terminal',
    ITGS : 'bx-globe-alt',
    ComTech : 'bx-message-rounded-edit'
} as const;

export interface SubjectItem {
  name: Subject_O
  iconClass: typeof SubjectIconList[SubjectItem['name']]
}

export interface SubjectGroup {
  name: SubjectGroup_O;
  iconClass: string;
  items: SubjectItem[];
}

export const NestedSubjectList: SubjectGroup[] = Object.entries(SubjectGroups).map( (kv, index) => 
{
    const key = kv[0] as SubjectGroup_O;
    const subjects = SubjectGroups[key] as readonly Subject_O[];
    return {
        name : key,
        iconClass : SubjectIconList[key],
        items : [
            ...subjects.map(name => ({
                name,
                iconClass : SubjectIconList[name]
            }))
        ]
    }
});