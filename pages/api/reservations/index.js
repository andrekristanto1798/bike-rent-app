import joi from "joi";
import nextConnect from "next-connect";
import withAuthMiddleware from "@/api-lib/withAuthMiddleware";
import validate from "@/api-lib/validation";
import { onError } from "@/api-lib/ncOnError";
import {
  snapshotToArray,
  ReservationCollections,
  BikeCollections,
  auth,
  RESERVATION_ENUM,
} from "@/utils/db";

const handler = nextConnect({ onError }).use(withAuthMiddleware());

const getReservationSchema = joi.object({
  bikeId: joi.string().optional(),
  userId: joi.string().optional(),
});

const createReservationSchema = joi.object({
  bikeId: joi.string().required(),
  startDate: joi.date().required(),
  endDate: joi.date().min(joi.ref("startDate")).required(),
});

// GET /reservations?bikeId={bikeId}&userId={userId}
handler.get(validate({ query: getReservationSchema })).get(async (req, res) => {
  let query = ReservationCollections();

  if (req.query.bikeId) {
    let bike = await BikeCollections().doc(req.query.bikeId).get();
    if (!bike.exists) {
      return res.status(400).json({
        error: `Bike ${req.query.bikeId} cannot be found!`,
      });
    }
    query = query.where("bikeId", "==", req.query.bikeId);
  }

  if (req.user.isManager && req.query.userId) {
    // only allow manager to query by user
    let user = await auth.getUser(req.query.userId);
    if (!user.exists) {
      return res.status(400).json({
        error: `User ${req.query.userId} cannot be found!`,
      });
    }
    query = query.where("userId", "==", req.query.userId);
  } else {
    // for non-manager use current user id (or when userId is not provided)
    query = query.where("userId", "==", req.user.id);
  }

  const snapshot = await query.get();

  return res.status(200).json({ reservations: snapshotToArray(snapshot) });
});

// POST /reservations
// body: { bikeId, startDate, endDate }
handler
  .post(validate({ body: createReservationSchema }))
  .post(async (req, res) => {
    const { bikeId, startDate, endDate } = req.body;
    const { id: userId, email: userEmail } = req.user;
    const bikeSnapshot = await BikeCollections().doc(bikeId).get();
    if (!bikeSnapshot.exists) {
      return res.status(400).json({
        error: `Bike ${bikeId} cannot be found!`,
      });
    }
    if (!bikeSnapshot.data().isAvailable) {
      return res.status(400).json({
        error: `Bike ${bikeId} is not available for reservation!`,
      });
    }

    const anyReservationsDuringThatPeriod = await ReservationCollections()
      .where("bikeId", "==", bikeId)
      .where("status", "==", RESERVATION_ENUM.ACTIVE)
      .where("startTime", "<=", new Date(endDate).getTime())
      .get();

    // why? because firestore cannot support multi range query T.T
    anyReservationsDuringThatPeriod.forEach((reservation) => {
      if (reservation.data().endTime >= new Date(startDate).getTime()) {
        throw new Error(
          `Found reservations conflict with another reservation. Please try another date!`
        );
      }
    });

    await ReservationCollections().add({
      userId,
      bikeId,
      user: { id: userId, email: userEmail },
      status: RESERVATION_ENUM.ACTIVE,
      startTime: new Date(startDate).getTime(),
      endTime: new Date(endDate).getTime(),
      startDate: startDate,
      endDate: endDate,
    });

    return res.status(200).json({ ok: true });
  });

export default handler;
