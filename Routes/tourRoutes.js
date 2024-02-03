const express = require("express");

const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
// const reviewController = require("./../controllers/reviewController");
const reviewRouter = require('./../Routes/reviewRouter')

const router = express.Router();

// router.param('id',tourController.checkId)
router.use('/:tourId/reviews',reviewRouter)

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

// router
//   .route("/:tourId/reviews")
//   .post(
//     authController.protect,
//     authController.restrictTo("user"),
//     reviewController.createReview
//   );

module.exports = router;
