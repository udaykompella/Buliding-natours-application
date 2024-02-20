const AppError = require("../utils/appError");

const handleCastErrDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 404);
};

const handleDuplicateFieldsDB = (err) => {
  // console.log(err,'errindupfields')
  console.log(err.errmsg, "err.errmsg");
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  console.log(value, "regex");
  const message = `Duplicate field values : ${value}, Please use another value`;
  return new AppError(message, 404);
};

const handleValidationErrorDB = (err) => {
  console.log(err, "errinvalidatondb");
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWT = () => new AppError('Invalid token ! Please Login again',401)

const handleJwtExpiredError = () => new AppError('Your token has been expired ! Please Login again',401)
 

const sendErrDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // RENDERED WEBSITE
    return res.status(err.statusCode).render("error", {
      title: "Something Went Wrong",
      msg: err.message,
    });
  }
};

const sendErrProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      return res.status(500).json({
        err,
        status: "error",
        message: "Something went very wrong",
      });
    }
  } else {
    //B Rendered website
    if (err.isOperational) {
      res.status(err.statusCode).render("error", {
        title: "Something Went Wrong",
        msg: err.message,
      });
    } else {
      res.status(err.statusCode).render("error", {
        title: "Something Went Wrong",
        // msg: err.message,
        msg: "Please try again later",
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  console.log(err, "ERRRR");
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log(process.env.NODE_ENV, "process.env.NODE_ENV");
  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    console.log(process.env.NODE_ENV, "process.env.Node");
    console.log(err, "errinprod");
    console.log(err.name, "errorname");
    let error = { ...err };
    error.message = err.message;
    // error.name = err.name
    if (error.name == "CastError") error = handleCastErrDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name == "ValidationError") error = handleValidationErrorDB(error);
    if (err.name == "JsonWebTokenError") error = handleJWT();
    if (err.name == "TokenExpiredError") error = handleJwtExpiredError();
    sendErrProd(error, req, res);
  }
};
