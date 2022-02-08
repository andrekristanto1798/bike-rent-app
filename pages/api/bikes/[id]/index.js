import nextConnect from "next-connect";
import withAuthMiddleware from "@/api-lib/withAuthMiddleware";
import withManagerMiddleware from "@/api-lib/withManagerMiddleware";
import validate from "@/api-lib/validation";
import { onError } from "@/api-lib/ncOnError";
import {
  BikeCollections,
  ColorCollections,
  createBikeSchema,
  getAvgRating,
  ModelCollections,
  RatingCollections,
  ReservationCollections,
  snapshotToArray,
  StoreCollections,
} from "@/utils/db";

const handler = nextConnect({ onError }).use(withAuthMiddleware());

handler.get(async (req, res) => {
  const snapshot = await BikeCollections().doc(req.query.id).get();
  if (!snapshot.exists) {
    return res
      .status(404)
      .json({ bike: null, error: `Bike ${req.query.id} cannot be found!` });
  }
  const bike = snapshot.data();
  if (!req.user.isManager && !bike.isAvailable) {
    return res.status(200).json({ bike: null });
  }
  let reservations = [];
  if (req.user.isManager) {
    reservations = await ReservationCollections()
      .where("bikeId", "==", req.query.id)
      .get();
  }
  const rating = await getAvgRating(req.query.id);
  const userRatingSnapshot = await RatingCollections(req.query.id)
    .doc(req.user.id)
    .get();
  const userRating = userRatingSnapshot.exists
    ? userRatingSnapshot.data().rating
    : false;
  return res.status(200).json({
    bike: {
      ...bike,
      rating,
      userRating,
      reservations: snapshotToArray(reservations).sort(
        (a, b) => b.startTime - a.startTime
      ),
    },
  });
});

handler
  .put(withManagerMiddleware())
  .put(validate({ body: createBikeSchema }))
  .put(async (req, res) => {
    const snapshot = await BikeCollections().doc(req.query.id).get();
    if (!snapshot.exists) {
      return res
        .status(404)
        .json({ bike: null, error: `Bike ${req.query.id} cannot be found!` });
    }
    await BikeCollections()
      .doc(req.query.id)
      .set({ ...req.body }, { merge: true });
    ModelCollections().doc(req.body.model).set({ name: req.body.model });
    StoreCollections().doc(req.body.location).set({ name: req.body.location });
    ColorCollections().doc(req.body.color).set({ hexColor: req.body.color });
    return res.status(200).json({ ok: true });
  });

handler.delete(withManagerMiddleware()).delete(async (req, res) => {
  const snapshot = await BikeCollections().doc(req.query.id).get();
  if (!snapshot.exists) {
    return res
      .status(404)
      .json({ bike: null, error: `Bike ${req.query.id} cannot be found!` });
  }
  await BikeCollections().doc(req.query.id).delete();
  return res.status(200).json({ ok: true });
});

export default handler;
