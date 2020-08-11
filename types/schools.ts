
export const SchoolList = [
    'Colonel By Secondary School',
    'Lisgar Collegiate Institute',
    'Earl of March Secondary School',
    'Other'
  ] as const
  
  export type School_O = typeof SchoolList[number]
  