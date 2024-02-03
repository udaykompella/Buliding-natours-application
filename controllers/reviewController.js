const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");

exports.createReview = catchAsync(async (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  let newReview = await Review.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});

exports.getAllReview = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const Reviews = await Review.find(filter);

  //send response
  res.status(200).json({
    status: "success",
    results: Reviews.length,
    data: {
      Reviews,
    },
  });
});
