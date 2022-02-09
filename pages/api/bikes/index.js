import joi from "joi";
import nextConnect from "next-connect";
import withAuthMiddleware from "@/api-lib/withAuthMiddleware";
import withManagerMiddleware from "@/api-lib/withManagerMiddleware";
import validate from "@/api-lib/validation";
import { onError } from "@/api-lib/ncOnError";
import {
  snapshotToArray,
  BikeCollections,
  ModelCollections,
  StoreCollections,
  ColorCollections,
  createBikeSchema,
  ReservationCollections,
  RESERVATION_ENUM,
  getAvgRating,
} from "@/utils/db";
import { FieldPath } from "firebase-admin/firestore";
import initAuth from "@/utils/initAuth";

initAuth();

const handler = nextConnect({ onError }).use(withAuthMiddleware());

const getBikeSchema = joi.object({
  model: joi.string().allow("").optional(),
  location: joi.string().allow("").optional(),
  color: joi
    .string()
    .regex(/^#[A-Fa-f0-9]{6}$/)
    .allow("")
    .optional(),
  startDate: joi.date().optional(),
  endDate: joi.date().min(joi.ref("startDate")).optional(),
  minRating: joi.number().min(0).max(5).optional(),
  maxRating: joi.number().min(0).max(5).optional(),
});

handler.get(validate({ query: getBikeSchema })).get(async (req, res) => {
  let query = BikeCollections();
  const { model, location, color, startDate, endDate, minRating, maxRating } =
    req.query;
  if (model) {
    query = query.where("model", "==", model);
  }
  if (location) {
    query = query.where("location", "==", location);
  }
  if (color) {
    query = query.where("color", "==", color);
  }
  if (!req.user.isManager) {
    // ensures for non-manager user to query only valid bikes
    query = query.where("isAvailable", "==", true);

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Start Date and End Date are required!" });
    }
    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();

    // find bikes which is reserved during [startDate, endDate] period
    const activeReservations = await ReservationCollections()
      .where("status", "==", RESERVATION_ENUM.ACTIVE)
      .where("startTime", "<=", endTime)
      .get();

    const invalidBikeIds = [];
    activeReservations.forEach((reservation) => {
      const data = reservation.data();
      if (data.endTime >= startTime) {
        invalidBikeIds.push(data.bikeId);
      }
    });
    if (invalidBikeIds.length) {
      query = query.where(FieldPath.documentId(), "not-in", invalidBikeIds);
    }
  }
  const snapshot = await query.get();
  let bikes = snapshotToArray(snapshot);
  if (req.user.isManager) {
    // populate totalBookings number
    const promises = bikes.map(async (bike) => {
      const reservations = await ReservationCollections()
        .where("bikeId", "==", bike.id)
        .get();
      return { ...bike, totalBookings: reservations.size };
    });
    bikes = await Promise.all(promises);
  }
  bikes = await Promise.all(
    bikes.map(async (bike) => {
      const rating = await getAvgRating(bike.id);
      return { ...bike, rating };
    })
  );
  if (minRating) {
    bikes = bikes.filter((d) => d.rating >= minRating);
  }
  if (maxRating) {
    bikes = bikes.filter((d) => d.rating <= maxRating);
  }
  return res.status(200).json({ bikes });
});

handler
  .post(withManagerMiddleware())
  .post(validate({ body: createBikeSchema }))
  .post(async (req, res) => {
    await BikeCollections().add({ ...req.body, rating: 0 });
    ModelCollections().doc(req.body.model).set({ name: req.body.model });
    StoreCollections().doc(req.body.location).set({ name: req.body.location });
    ColorCollections().doc(req.body.color).set({ hexColor: req.body.color });
    return res.status(200).json({ ok: true });
  });

export default handler;
