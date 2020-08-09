


export const SubjectGroups = {
  Sciences: ['Physics', 'Chemistry', 'Biology', 'Math'],
  Languages: ['English', 'French', 'Spanish'],
  Arts: ['Visual Arts', 'Music', 'Dance', 'Drama', 'Film'],
  'Social Sciences': ['TOK', 'Geography', 'History', 'Business'],
  Technology: ['ICS', 'ITGS', 'ComTech']
} as const

export const SortOptionsList = [{
  name : "Up Votes", value : "upVotes"
},
{
  name : "Views", value : "views",
},
{
  name : "Recent", value : 'createdAt'
}] as const

export type SortOptions_O = typeof SortOptionsList[number]['value']
export type SubjectGroup_O = keyof typeof SubjectGroups;
export const GradeList = [9,10,11,12, "ALL"] as const;
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
    Sciences : 'bx-bulb',
    Languages : 'bx-pen',
    Arts : 'bx-palette',
    "Social Sciences" : 'bx-world',
    Technology : 'bx-server',

    Math : 'bx-brain',
    'Physics' : 'bx-atom',
    Chemistry : 'bxs-flask',
    Biology : 'bx-dna',
    'English' : 'bx-book-bookmark',
    French : 'bx-book',
    'Spanish' : 'bx-bible',
    "Visual Arts" : 'bxs-brush',
    Music : 'bxs-music',
    Dance : 'bxs-guitar-amp',
    Drama : 'bx-mask',
    Film : 'bx-camera-movie',
    TOK : 'bx-network-chart',
    'Geography' : 'bx-globe',
    History : 'bxs-landmark',
    Business : 'bx-briefcase',
    ICS : 'bx-code-alt',
    ITGS : 'bx-data',
    ComTech : 'bxs-component'
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