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

const handleValidationErrorDB = err => {
  
}

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      err,
      status: "error",
      message: "Something went very wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log(err, "ERRRR");
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log(process.env.NODE_ENV, "process.env.NODE_ENV");
  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    console.log(process.env.NODE_ENV, "process.env.Node");
    let error = { ...err };
    error.errmsg = err.errmsg;
    console.log(error, "errinprod");
    if (error.name == "CastError") error = handleCastErrDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if(error.name == "ValidationError") error = handleValidationErrorDB(error)
    sendErrProd(error, res);
  }
};
