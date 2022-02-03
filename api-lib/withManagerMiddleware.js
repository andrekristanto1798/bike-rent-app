import db from "@/utils/db";

const withManagerMiddleware = () => async (req, res, next) => {
  try {
    const snapshot = await db
      .collection("userRoles")
      .where("email", "==", req.user.email)
      .get();
    if (snapshot.empty) {
      return res.status(400).json({
        error: `Unable to find the user role for ${req.user.email}`,
      });
    }
    const data = [];
    snapshot.forEach((doc) => {
      data.push(doc.data());
    });
    if (data[0].roles === "manager") {
      req.user.roles = data[0].roles;
      return next();
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
  return res.status(403).json({ error: "Not authorized" });
};

export default withManagerMiddleware;
