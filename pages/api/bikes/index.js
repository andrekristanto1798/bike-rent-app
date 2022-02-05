import joi from "joi";
import nextConnect from "next-connect";
import withAuthMiddleware from "@/api-lib/withAuthMiddleware";
import withManagerMiddleware from "@/api-lib/withManagerMiddleware";
import validate from "@/api-lib/validation";
import {
  snapshotToArray,
  BikeCollections,
  ModelCollections,
  StoreCollections,
} from "@/utils/db";

const handler = nextConnect().use(withAuthMiddleware());

handler.get(async (req, res) => {
  const snapshot = await BikeCollections().get();
  return res.status(200).json(snapshotToArray(snapshot));
});

const schema = joi.object({
  model: joi.string().required(),
  location: joi.string().required(),
  color: joi.string().regex(/^#[A-Fa-f0-9]{6}$/),
  isAvailable: joi.bool().required(),
});

handler
  .post(withManagerMiddleware())
  .post(validate({ body: schema }))
  .post(async (req, res) => {
    await BikeCollections().add({ ...req.body, rating: 0 });
    ModelCollections().doc(req.body.model).set({ name: req.body.model });
    StoreCollections().doc(req.body.location).set({ name: req.body.location });
    return res.status(200).json({ ok: true });
  });

export default handler;
