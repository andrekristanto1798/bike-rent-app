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
} from "@/utils/db";

const handler = nextConnect({ onError }).use(withAuthMiddleware());

const getBikeSchema = joi.object({
  model: joi.string().allow("").optional(),
  location: joi.string().allow("").optional(),
  color: joi
    .string()
    .regex(/^#[A-Fa-f0-9]{6}$/)
    .allow("")
    .optional(),
});

handler
  .get(withManagerMiddleware({ enforce: false }))
  .get(validate({ query: getBikeSchema }))
  .get(async (req, res) => {
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
      // - show all bikes for manager user
      // - show available bikes for normal user
      query = query.where("isAvailable", "==", true);
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
