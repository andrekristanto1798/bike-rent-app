import nextConnect from "next-connect";
import withAuthMiddleware from "@/api-lib/withAuthMiddleware";
import { BIKES } from "@/api-lib/mock";

const handler = nextConnect().use(withAuthMiddleware());

handler.get((req, res) => {
  return res.status(200).json(BIKES);
});

export default handler;
