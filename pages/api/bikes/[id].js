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

const reservations = [
  {
    id: 1,
    user: { id: 1, name: "ABC" },
    date: "2021-01-01",
    createdAt: "2021-01-01T00:12:00Z",
    duration: 2,
    cancelled: false,
  },
  {
    id: 2,
    user: { id: 1, name: "DEF" },
    date: "2021-01-03",
    createdAt: "2021-01-03T00:12:00Z",
    duration: 1,
    cancelled: true,
  },
  {
    id: 3,
    user: { id: 1, name: "HIJ" },
    date: "2021-01-03",
    createdAt: "2021-01-03T00:12:00Z",
    duration: 1,
    cancelled: false,
  },
  {
    id: 4,
    user: { id: 1, name: "KLM" },
    date: "2021-01-10",
    createdAt: "2021-01-10T00:12:00Z",
    duration: 1,
    cancelled: false,
  },
  {
    id: 5,
    user: { id: 1, name: "NOP" },
    date: "2021-01-12",
    createdAt: "2021-01-12T00:12:00Z",
    duration: 1,
    cancelled: false,
  },
];

const handler = nextConnect().use(withAuthMiddleware());

handler.get((req, res) => {
  const bike = bikes.find((b) => b.id === +req.query.id);
  if (!bike) {
    return res
      .status(404)
      .json({ error: `Bike ${req.query.id} cannot be found!` });
  }
  return res.status(200).json({ ...bike, reservations });
});

export default handler;
