import { Timestamp } from '~/types/env.utils';

export const HourDiff = (date: Timestamp) => {
  const now = Timestamp.now().toDate();
  try{
    const Difference_In_Time = now.getTime() - date.toDate().getTime();
    const DifferenceInHours = Difference_In_Time / (1000 * 3600);
    return DifferenceInHours;
  }catch(error){
    console.log(error)
    return 0
  }
};
