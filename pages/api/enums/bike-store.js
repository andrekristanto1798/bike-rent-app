import nextConnect from "next-connect";
import { snapshotToArray, StoreCollections } from "@/utils/db";
import { onError } from "@/api-lib/ncOnError";

const handler = nextConnect({ onError });

handler.get(async (req, res) => {
  const snapshot = await StoreCollections().get();
  const stores = snapshotToArray(snapshot);
  return res.status(200).json({ stores });
});

export default handler;
