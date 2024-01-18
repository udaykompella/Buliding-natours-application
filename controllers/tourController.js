const fs = require("fs");
const Tour = require("./../models/TourModel");
const apiFeatures = require("./../apiFeatures");

// const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`));
exports.updateTour = async (req, res) => {
  try {
    const tours = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        tour: tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    //Build Query
    // 1) Filtering
    console.log(req,"reonalltours")
    console.log(req.query, "sdsss");

    // const tours = await Tour.find().where('duration').equals(5).where('difficult').equals('easy')
    //2) Sorting

    //3)Field Limiting

    //4) pagination

    //Execute query
    // const tours = await query;
    let features = new apiFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .paginate()
      .limitFields();
    //query.sort().select().skip().limit()
    // let tours = await features.query;
    let tours = await features.query;

    console.log(tours, "gettours");
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    console.log(req.params.id,"idoftour")
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }

  // console.log(tour)
  res.status(200).json({});
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }

  const newTour = await Tour.create(req.body);
  // res.send('Done')
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(201).json({});
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: "$difficulty",
          numOfTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRatiing: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numTourStarts: -1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
