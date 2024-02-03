const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authContoller = require("./../controllers/authController");

const Router = express.Router({ mergeParams: true });

Router.route("/")
  .get(reviewController.getAllReview)
  .post(
    authContoller.protect,
    authContoller.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );
Router.route("/:id")
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = Router;
