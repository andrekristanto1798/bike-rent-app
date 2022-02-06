import joi from "joi";
import nextConnect from "next-connect";
import withAuthMiddleware from "@/api-lib/withAuthMiddleware";
import withManagerMiddleware from "@/api-lib/withManagerMiddleware";
import validate from "@/api-lib/validation";
import { onError } from "@/api-lib/ncOnError";
import { auth } from "@/utils/db";

const handler = nextConnect({ onError })
  .use(withAuthMiddleware())
  .use(withManagerMiddleware());

handler.get(async (req, res) => {
  const records = await auth.listUsers();
  const users = records.users.map((d) => {
    const user = d.toJSON();
    return { ...user, isManager: d.customClaims?.isManager || false };
  });
  return res.status(200).json({ users });
});

const userSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
  isManager: joi.boolean().required(),
});

handler.post(validate({ body: userSchema })).post(async (req, res) => {
  const { email, password } = req.body;
  const user = await auth.createUser({ email, password });
  await auth.setCustomUserClaims(user.uid, { isManager: req.body.isManager });
  return res.status(200).json({ ok: true });
});

export default handler;
