import nextConnect from "next-connect";
import withAuthMiddleware from "@/api-lib/withAuthMiddleware";
import { onError } from "@/api-lib/ncOnError";
import { ReservationCollections, RESERVATION_ENUM } from "@/utils/db";

const handler = nextConnect({ onError }).use(withAuthMiddleware());

// POST /cancel
// body: {}
handler.post(async (req, res) => {
  const reservationId = req.query.id;
  const requestUserId = req.user.id;
  const reservationSnapshot = await ReservationCollections()
    .doc(reservationId)
    .get();
  if (!reservationSnapshot.exists) {
    return res.status(400).json({
      error: `Reservation ${reservationId} cannot be found!`,
    });
  }
  const { userId, startTime } = reservationSnapshot.data();

  if (startTime <= Date.now()) {
    return res.status(400).json({
      error: `Reservation ${reservationId} is already past the start date. It cannot be cancelled!`,
    });
  }
  if (!req.user.isManager && userId !== requestUserId) {
    // only allow non-manager to cancel his own reservation
    return res.status(400).json({
      error: `Reservation ${reservationId} is not available for reservation!`,
    });
  }

  await ReservationCollections()
    .doc(reservationId)
    .set({ status: RESERVATION_ENUM.CANCELLED }, { merge: true });

  return res.status(200).json({ ok: true });
});

export default handler;
