import nextConnect from "next-connect";
import { snapshotToArray, ModelCollections } from "@/utils/db";

const handler = nextConnect();

handler.get(async (req, res) => {
  const snapshot = await ModelCollections().get();
  const models = snapshotToArray(snapshot);
  return res.status(200).json({ models });
});

export default handler;
