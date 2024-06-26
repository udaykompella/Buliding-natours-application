const path = require("path");
const express = require("express");
const fs = require("fs");
const app = express();
const AppError = require("./utils/appError");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const tourRouter = require("./Routes/tourRoutes");
const userRouter = require("./Routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");
const reviewRoute = require("./Routes/reviewRouter");
const bookingRouter = require("./Routes/bookingRoutes");
const viewRoute = require("./Routes/viewRoutes");

// const globalErrorHandler = require("./dev-data/data/import-dev-data");

app.set("view engine", "pug");

app.set("views", path.join(__dirname, "views"));

//serving static filess
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, "public")));
//1)GLOBAL MIDDLEWARES
app.use(cors());

// app.use(cors({
//   origin:
// }))

app.options("*", cors());

//set security http headers
// app.use(helmet());
app.use(helmet({ contentSecurityPolicy: false }));

//limit request from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

//Body parser reading data from body into req.body
app.use(
  express.json({
    limit: "10kb",
  })
); /// this is a middleware which is used to parse the request recieved from the client
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

//Data sanitization against NOSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());
//prevent parameter polluition
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(compression());

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

app.use("/", viewRoute);
app.use("/api/v1/tours", tourRouter); // This acts as a middleware that is when new request hits it goes into middleware stack
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
//
