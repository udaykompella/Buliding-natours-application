const express = require("express");

const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");

const router = express.Router();

// router.param('id',tourController.checkId)

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router.route("/tour-stats").get(tourController.getTourStats);
router.route("/busy-Month/:year").get(tourController.getMonthlyPlan);
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
