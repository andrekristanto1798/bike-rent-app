import nextConnect from "next-connect";
import withAuthMiddleware from "@/api-lib/withAuthMiddleware";
import withManagerMiddleware from "@/api-lib/withManagerMiddleware";
import validate from "@/api-lib/validation";
import { onError } from "@/api-lib/ncOnError";
import {
  BikeCollections,
  ColorCollections,
  createBikeSchema,
  ModelCollections,
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
  const reservations = await ReservationCollections()
    .where("bikeId", "==", req.query.id)
    .get();
  return res.status(200).json({
    bike: {
      ...bike,
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

export default handler;
