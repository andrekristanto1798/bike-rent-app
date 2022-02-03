import { verifyIdToken } from "next-firebase-auth";
import initAuth from "../utils/initAuth";

initAuth();

const withAuthMiddleware = () => async (req, res, next) => {
  if (!(req.headers && req.headers.authorization)) {
    return res
      .status(400)
      .json({ error: "Missing Authorization header value" });
  }

  const token = req.headers.authorization;

  try {
    // user: {id, email, emailVerified, phoneNumber, displayName, photoURL}
    const user = await verifyIdToken(token);
    req.user = user;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return res.status(403).json({ error: "Not authorized" });
  }

  next();
};

export default withAuthMiddleware;
