import joi from "joi";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

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
export const ReservationCollections = () => db.collection("reservations");

export const auth = getAuth();

export const createBikeSchema = joi.object({
  model: joi.string().required(),
  location: joi.string().required(),
  color: joi.string().regex(/^#[A-Fa-f0-9]{6}$/),
  isAvailable: joi.bool().required(),
});

export const RESERVATION_ENUM = {
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
};

export default db;
