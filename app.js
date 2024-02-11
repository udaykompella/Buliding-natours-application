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
const tourRouter = require("./Routes/tourRoutes");
const userRouter = require("./Routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");
const reviewRoute = require("./Routes/reviewRouter");
// const globalErrorHandler = require("./dev-data/data/import-dev-data");

app.set("view engine", "pug");

app.set("views", path.join(__dirname, "views"));

//serving static filess
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, "public")));
//1)GLOBAL MIDDLEWARES
//set security http headers
app.use(helmet());

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

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get("/", (req, res) => {
  res.status(200).render("base");
});

app.get("/overview", (req, res) => {
  res.status(200).render("overview", {
    title: "All Tours",
  });
});
app.get("/tour", (req, res) => {
  res.status(200).render("tour", {
    title: "The Forest Hiker Tour",
  });
});
app.use("/api/v1/tours", tourRouter); // This acts as a middleware that is when new request hits it goes into middleware stack
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
//
