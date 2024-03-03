const express = require("express");
const bookingController = require("./../controllers/bookingController");
const authContoller = require("./../controllers/authController");

const router = express.Router();

router.use(authContoller.protect);

router.get(
  "/checkout-session/:tourId",
  authContoller.protect,
  bookingController.getCheckoutSession
);

router
  .use("/")
  .get(bookingController.getAllBooking)
  .post(bookingController.createBooking);

router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

router.route("/").get(bookingController.getAllBooking);

module.exports = router;
