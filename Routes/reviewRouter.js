const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authContoller = require("./../controllers/authController");

const Router = express.Router({ mergeParams: true });

Router.use(authContoller.protect);
Router.route("/")
  .get(reviewController.getAllReview)
  .post(
    authContoller.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );
Router.route("/:id")
  .get(reviewController.getReview)
  .patch(
    authContoller.restrictTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    authContoller.restrictTo("user", "admin"),
    reviewController.deleteReview
  );

module.exports = Router;
