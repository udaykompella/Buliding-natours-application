const fs = require('fs');
const Tour = require('./../models/TourModel');

// const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`));
exports.updateTour = async (req, res) => {
  try {
    const tours = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};
exports.getAllTours = async (req, res) => {
  try {
    //Build Query
    // 1) Filtering
    console.log(req.query,"sdsss")
    let queryObj = { ...req.query };

    let excludedFields = ['page', 'limit', 'sort', fields];

    excludedFields.forEach((el) => delete queryObj[el]);

    //2) Advance Filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    console.log(JSON.parse(queryString));

    const query = await Tour.find(queryObj);

    const tours = await query

    // const tours = await Tour.find().where('duration').equals(5).where('difficult').equals('easy')

    console.log(tours, 'gettours');
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
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
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
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
      status: 'fail',
      message: error,
    });
  }
};
