import nextConnect from "next-connect";
import withAuthMiddleware from "@/api-lib/withAuthMiddleware";
import withManagerMiddleware from "@/api-lib/withManagerMiddleware";
import db, { snapshotToArray } from "@/utils/db";

const ModelCollections = () => db.collection("models");

const handler = nextConnect();

handler.get(async (req, res) => {
  const snapshot = await ModelCollections().get();
  const models = snapshotToArray(snapshot);
  return res.status(200).json({ models });
});

handler
  .post(withAuthMiddleware())
  .post(withManagerMiddleware())
  .post(async (req, res) => {
    const { name } = req.body;
    if (!name?.trim?.()) {
      return res.status(400).json({ error: "Bike model name cannot be empty" });
    }
    const snapshot = await ModelCollections().doc(name).get();
    if (!snapshot.empty) {
      return res.status(409).json({ error: "Duplicate model name" });
    }
    await ModelCollections().doc(name).set({ name });
    return res.status(204);
  });

export default handler;
