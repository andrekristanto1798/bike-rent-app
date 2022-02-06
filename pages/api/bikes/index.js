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
} from "@/utils/db";
import { FieldPath } from "firebase-admin/firestore";

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
});

handler.get(validate({ query: getBikeSchema })).get(async (req, res) => {
  let query = BikeCollections();
  if (req.query.model) {
    query = query.where("model", "==", req.query.model);
  }
  if (req.query.location) {
    query = query.where("location", "==", req.query.location);
  }
  if (req.query.color) {
    query = query.where("color", "==", req.query.color);
  }
  if (!req.user.isManager) {
    // ensures for non-manager user to query only valid bikes
    query = query.where("isAvailable", "==", true);

    const { startDate, endDate } = req.query;
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
  return res.status(200).json({ bikes: snapshotToArray(snapshot) || [] });
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
