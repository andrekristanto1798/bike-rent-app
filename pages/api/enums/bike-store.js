import nextConnect from "next-connect";
import withAuthMiddleware from "@/api-lib/withAuthMiddleware";
import withManagerMiddleware from "@/api-lib/withManagerMiddleware";
import db, { snapshotToArray } from "@/utils/db";

const StoreCollections = () => db.collection("stores");

const handler = nextConnect();

handler.get(async (req, res) => {
  const snapshot = await StoreCollections().get();
  const stores = snapshotToArray(snapshot);
  return res.status(200).json({ stores });
});

handler
  .post(withAuthMiddleware())
  .post(withManagerMiddleware())
  .post(async (req, res) => {
    const { name, address } = req.body;
    if (!name?.trim?.() || !address?.trim?.()) {
      return res
        .status(400)
        .json({ error: "Store name or address cannot be empty" });
    }
    const snapshot = await StoreCollections().doc(name).get();
    if (!snapshot.empty) {
      return res.status(409).json({ error: "Duplicate store name" });
    }
    await StoreCollections().doc(name).set({ name, address });
    return res.status(204);
  });

export default handler;
