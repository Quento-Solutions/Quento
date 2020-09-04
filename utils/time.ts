import { firestore } from 'firebase/app';

export const HourDiff = (date: firestore.Timestamp) => {
  const now = firestore.Timestamp.now().toDate();
  const Difference_In_Time = now.getTime() - date.toDate().getTime();
  const DifferenceInHours = Difference_In_Time / (1000 * 3600);
  return DifferenceInHours;
};
