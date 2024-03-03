const express = require("express");
const bookingController = require("./../controllers/bookingController");
const authContoller = require("./../controllers/authController");

const router = express.Router();

router.get(
  "/checkout-session/:tourId",
  authContoller.protect,
  bookingController.getCheckoutSession
);

module.exports = router;
