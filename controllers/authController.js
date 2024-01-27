const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/UserModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    // passwordChangedAt: req.body.passwordChangedAt,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = async (req, res, next) => {
  console.log(req.body, ">>>>");
  const { email, password } = req.body;

  //1) check if email and password exists
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  //2) check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //3) If everything is ok send token to the client

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  //1) Getting token and check if its there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // console.log(token);

  if (!token) {
    return next(
      new AppError("You are not logged in ! Please login to get access", 401)
    );
  }

  //2) verificatoion token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  //3)check if user still exits
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );
  }

  //4)check if user change password after token is issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please Login Again.", 401)
    );
  }
  //Grant Access to protected route
  req.user = currentUser;
  // console.log(req.user, "req.user");
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles['admin','lead-guide]. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have to permission this action", 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email Address", 404));
  }
  //Generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send it to  users email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to : ${resetUrl}.\n if you didn't forget your password please ignore this email`;
  try {
    await sendEmail({
      email: req.body.email,
      subject: "Your password reset token (valid for 10min)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(`There was an error sending the email. Try again later`, 500)
    );
  }
});

exports.resetPassword = (req, res, next) => {};
