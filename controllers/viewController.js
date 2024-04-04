const Tour = require("../models/TourModel");
const User = require("../models/UserModel");
const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getOverview = catchAsync(async (req, res) => {
  //1)Get tour data from collection
  const tours = await Tour.find();

  //2) Build template

  //3)Render that template using tour data from 1

  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //1) Get the data, fro the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    field: "review rating user",
  });

  if (!tour) {
    return next(new AppError("There is no tour with that name", 404));
  }
  //2} Build template

  //3) Render template using data from 1

  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res
    .status(200)

    .render("login", {
      title: "Log in to your account",
    });
};
exports.getSignUpForm = (req, res) => {
  res.status(200).render("signup", {
    title: `Create New Account`,
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account",
  });
};
exports.getMyTours = catchAsync(async (req, res, next) => {
  //1)Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  //2)Find tours with the returned ids
  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render("overview", {
    title: "My Tours",
    tours,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render("account", {
    title: "Your account",
    user: updatedUser,
  });
});
