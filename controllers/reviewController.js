const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");

exports.createReview = catchAsync(async (req, res, next) => {
  let newReview = await Review.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});

exports.getAllReview = catchAsync(async (req, res, next) => {
  const Reviews = await Review.find();

  //send response
  res.status(200).json({
    status: "success",
    results: Reviews.length,
    data: {
      Reviews,
    },
  });
});
