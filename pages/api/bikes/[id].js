import nextConnect from "next-connect";
import withAuthMiddleware from "@/api-lib/withAuthMiddleware";
import { BIKES, RESERVATIONS } from "@/api-lib/mock";

const handler = nextConnect().use(withAuthMiddleware());

handler.get((req, res) => {
  const bike = BIKES.find((b) => b.id === +req.query.id);
  if (!bike) {
    return res
      .status(404)
      .json({ error: `Bike ${req.query.id} cannot be found!` });
  }
  return res
    .status(200)
    .json({ ...bike, reservations: RESERVATIONS, isAvailable: true });
});

export default handler;
