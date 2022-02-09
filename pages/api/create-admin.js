import nextConnect from "next-connect";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import withAuthMiddleware from "@/api-lib/withAuthMiddleware";
import withManagerMiddleware from "@/api-lib/withManagerMiddleware";
import { onError } from "@/api-lib/ncOnError";
import initAuth from "@/utils/initAuth";

initAuth();

const handler = nextConnect({ onError })
  .use(withAuthMiddleware())
  .use(withManagerMiddleware());

handler.post((req, res) => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then((userCredential) => {
      console.log("admin-created", { userCredential });
      return res.status(200).json({ ok: true });
    })
    .catch((error) => {
      console.error("unable to create admin", { error });
      return res.status(400).json({ error });
    });
});

export default handler;
