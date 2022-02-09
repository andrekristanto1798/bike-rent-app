import joi from "joi";
import nextConnect from "next-connect";
import withAuthMiddleware from "@/api-lib/withAuthMiddleware";
import withManagerMiddleware from "@/api-lib/withManagerMiddleware";
import validate from "@/api-lib/validation";
import { onError } from "@/api-lib/ncOnError";
import { auth } from "@/utils/db";
import initAuth from "@/utils/initAuth";

initAuth();

const handler = nextConnect({ onError })
  .use(withAuthMiddleware())
  .use(withManagerMiddleware());

const uidSchema = joi.object({
  uid: joi.string().required(),
});

const updateUserSchema = joi.object({
  password: joi.string().optional(),
  isManager: joi.boolean().required(),
});

// PATCH /users/[uid] -> reset password + is manager flag
handler
  .patch(validate({ query: uidSchema, body: updateUserSchema }))
  .patch(async (req, res) => {
    if (req.body.password) {
      await auth.updateUser(req.query.uid, { password: req.body.password });
    }
    await auth.setCustomUserClaims(req.query.uid, {
      isManager: req.body.isManager,
    });
    return res.status(200).json({ ok: true });
  });

// DELETE /users/[uid] -> remove user
handler.delete(validate({ query: uidSchema })).delete(async (req, res) => {
  await auth.deleteUser(req.query.uid);
  return res.status(200).json({ ok: true });
});

export default handler;
