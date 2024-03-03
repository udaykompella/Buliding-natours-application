// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Stripe = require("stripe");
const Tour = require("./../models/TourModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./../controllers/handleFactory");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1) Get currently booked tour
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const tour = await Tour.findById(req.params.tourId);

  //2)create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "inr",
          unit_amount: tour.price,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
        },
      },
    ],
    mode: "payment",
  });

  //3)create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});
