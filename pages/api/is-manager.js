import nextConnect from "next-connect";
import withAuthMiddleware from "@/api-lib/withAuthMiddleware";
import withManagerMiddleware from "@/api-lib/withManagerMiddleware";
import { onError } from "@/api-lib/ncOnError";

const handler = nextConnect({ onError })
  .use(withAuthMiddleware())
  .use(withManagerMiddleware());

handler.get((req, res) => {
  return res.status(200).json({ user: req.user });
});

export default handler;
