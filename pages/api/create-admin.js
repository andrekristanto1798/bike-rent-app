import nextConnect from "next-connect";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import withAuthMiddleware from "@/api-lib/withAuthMiddleware";
import withManagerMiddleware from "@/api-lib/withManagerMiddleware";
import { onError } from "@/api-lib/ncOnError";

const handler = nextConnect({ onError })
  .use(withAuthMiddleware())
  .use(withManagerMiddleware());

handler.post((req, res) => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("admin-created", { userCredential });
    })
    .catch((error) => {
      console.error("unable to create admin", { error });
    });
});

export default handler;
