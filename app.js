const express = require("express");
const fs = require("fs");
const app = express();

const tourRouter = require("./Routes/tourRoutes");
const userRouter = require("./Routes/userRoutes");

app.use(express.json()); /// this is a middleware which is used to parse the request recieved from the client
app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/tours", tourRouter); // This acts as a middleware that is when new request hits it goes into middleware stack
app.use("api/v1/users", userRouter);

app.all("*", (req, res) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Cannot find ${req.originalUrl} on the server`,
  // });

  const err = new Error(`Cannot find ${req.originalUrl} on the server`);
  err.status = "fail";
  err.statusCode = 400;
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
//
