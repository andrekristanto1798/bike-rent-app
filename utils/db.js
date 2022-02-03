import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export const snapshotToArray = (snapshot) => {
  const data = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
};

export default db;
