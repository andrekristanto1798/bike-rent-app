import nextConnect from "next-connect";
import withAuthMiddleware from "@/api-lib/withAuthMiddleware";

const storeA = {
  name: "Store A",
  address: "138 Address St\nUstania, TX, 12399",
};
const storeB = {
  name: "Store B",
  address: "120 Ukansfr St\nUstania, TX, 12399",
};

const bikes = [
  { id: 1, model: "Yamaha FZ-X", rating: 4, location: storeA, color: "red" },
  { id: 2, model: "TVS Raider 125", rating: 4, location: storeA, color: "red" },
  { id: 3, model: "KTM RC 200", rating: 4, location: storeA, color: "red" },
  { id: 4, model: "KTM RC 390", rating: 4, location: storeA, color: "red" },
  {
    id: 5,
    model: "Hero Splendor Plus",
    rating: 4,
    location: storeB,
    color: "red",
  },
  { id: 6, model: "Honda Shine", rating: 4, location: storeB, color: "red" },
  { id: 7, model: "Honda SP 125", rating: 4, location: storeB, color: "red" },
  {
    id: 8,
    model: "Royal Enfield Meteor 350",
    rating: 4,
    location: storeB,
    color: "red",
  },
];

const handler = nextConnect().use(withAuthMiddleware());

handler.get((req, res) => {
  return res.status(200).json(bikes);
});

export default handler;
