import nextConnect from "next-connect";
import { snapshotToArray, ModelCollections } from "@/utils/db";
import { onError } from "@/api-lib/ncOnError";
import initAuth from "@/utils/initAuth";

initAuth();

const handler = nextConnect({ onError });

handler.get(async (req, res) => {
  const snapshot = await ModelCollections().get();
  const models = snapshotToArray(snapshot);
  return res.status(200).json({ models });
});

export default handler;
