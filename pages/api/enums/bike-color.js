import nextConnect from "next-connect";
import { ColorCollections, snapshotToArray } from "@/utils/db";
import { onError } from "@/api-lib/ncOnError";

const handler = nextConnect({ onError });

handler.get(async (req, res) => {
  const snapshot = await ColorCollections().get();
  const colors = snapshotToArray(snapshot);
  return res.status(200).json({ colors: colors.map((c) => c.hexColor) });
});

export default handler;
