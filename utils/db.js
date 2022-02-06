import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export const snapshotToArray = (snapshot) => {
  const data = [];
  snapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
};

export const ModelCollections = () => db.collection("models");
export const StoreCollections = () => db.collection("stores");
export const ColorCollections = () => db.collection("colors");
export const BikeCollections = () => db.collection("bikes");

export default db;
