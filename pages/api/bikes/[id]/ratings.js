import joi from "joi";
import nextConnect from "next-connect";
import withAuthMiddleware from "@/api-lib/withAuthMiddleware";
import validate from "@/api-lib/validation";
import { onError } from "@/api-lib/ncOnError";
import { BikeCollections, RatingCollections } from "@/utils/db";
import initAuth from "@/utils/initAuth";

initAuth();

const handler = nextConnect({ onError }).use(withAuthMiddleware());

export const ratingSchema = joi.object({
  rating: joi.number().min(1).max(5).required(),
});

handler.put(validate({ body: ratingSchema })).put(async (req, res) => {
  const bikeId = req.query.id;
  const userId = req.user.id;
  const { rating } = req.body;
  const snapshot = await BikeCollections().doc(bikeId).get();
  if (!snapshot.exists) {
    return res
      .status(404)
      .json({ bike: null, error: `Bike ${bikeId} cannot be found!` });
  }
  await RatingCollections(bikeId).doc(userId).set({ rating });

  return res.status(200).json({ ok: true });
});

export default handler;
