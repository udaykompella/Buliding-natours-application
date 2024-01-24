const User = require("./../models/UserModel");
const catchAsync = require("./../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res,next) => {
  const users = await User.find();

  //send response
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: "err",
    message: "Route is not yet implemented",
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "err",
    message: "Route is not yet implemented",
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "err",
    message: "Route is not yet implemented",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "err",
    message: "Route is not yet implemented",
  });
};
