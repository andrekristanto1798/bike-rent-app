import nextConnect from "next-connect";
import withAuthMiddleware from "@/api-lib/withAuthMiddleware";
import { BikeCollections } from "@/utils/db";
import { RESERVATIONS } from "@/api-lib/mock";
import { onError } from "@/api-lib/ncOnError";

const handler = nextConnect({ onError }).use(withAuthMiddleware());

handler.get(async (req, res) => {
  const snapshot = await BikeCollections().doc(req.query.id).get();
  if (!snapshot.exists) {
    return res
      .status(404)
      .json({ bike: null, error: `Bike ${req.query.id} cannot be found!` });
  }
  const bike = snapshot.data();
  return res
    .status(200)
    .json({ bike: { ...bike, reservations: RESERVATIONS } });
});

export default handler;
