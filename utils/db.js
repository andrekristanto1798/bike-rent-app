import joi from "joi";
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

export const createBikeSchema = joi.object({
  model: joi.string().required(),
  location: joi.string().required(),
  color: joi.string().regex(/^#[A-Fa-f0-9]{6}$/),
  isAvailable: joi.bool().required(),
});

export default db;
