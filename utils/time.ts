import { Timestamp } from '~/types/env.utils';

export const HourDiff = (date: Timestamp) => {
  const actualDate = new Timestamp(date.seconds, date.nanoseconds)
  const now = Timestamp.now().toDate();
  const Difference_In_Time = now.getTime() - actualDate.toDate().getTime();
  const DifferenceInHours = Difference_In_Time / (1000 * 3600);
  return DifferenceInHours;
};
