import joi from "joi";
import fb from "firebase-admin";

export const firebase = !fb.apps.length
  ? fb.initializeApp({
      credential: fb.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
          : undefined,
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    })
  : fb.app();

export const db = fb.firestore();
export const auth = fb.auth();

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
export const RatingCollections = (bikeId) =>
  db.collection("bikes").doc(bikeId).collection("ratings");

export const getAvgRating = async (bikeId) => {
  const ratings = await RatingCollections(bikeId).get();
  let sumRating = 0;
  ratings.forEach((docSnapshot) => {
    sumRating += docSnapshot.data().rating;
  });
  return Number((sumRating / ratings.size).toFixed(2));
};

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
