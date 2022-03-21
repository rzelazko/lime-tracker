import { Timestamp } from 'firebase/firestore';
import * as moment from 'moment';
import { Moment } from 'moment';

interface FirebaseSnapshot {
  id: any;
  data: () => any;
}

export function convertSnapshots<T>(results: any) {
  return <T[]>results.data().map((snap: FirebaseSnapshot) => convertSnapshot(snap));
}

export function convertSnapshot<T>(result: FirebaseSnapshot, extraData?: any) {
  return <T>{
    id: result.id,
    ...convertFromTimestamps(result.data()),
    ...extraData,
  };
}

export function convertFromTimestamps(obj: { [index: string]: any }) {
  const converted: { [index: string]: any } = {};
  for (let [key, value] of Object.entries(obj)) {
    if (value instanceof Timestamp) {
      converted[key] = moment((value as Timestamp).toDate());
    } else {
      converted[key] = value;
    }
  }
  return converted;
}

export function convertToTimestamps(obj: { [index: string]: any }) {
  const converted: { [index: string]: any } = {};
  for (let [key, value] of Object.entries(obj)) {
    if (value instanceof moment) {
      converted[key] = Timestamp.fromDate((value as Moment).toDate());
    } else {
      converted[key] = value;
    }
  }
  return converted;
}
