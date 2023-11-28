const fs = require('fs');
const Tour = require('./../models/TourModel');

// const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`));
exports.updateTour = async(req, res) => {
  try{
    const tours = await Tour.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true 
    })
  
    res.status(200).json({
      status: 'success',
      data:{
        tour:tours
      }
    });
  }catch(error){
    res.status(400).json({
      status:"fail",
      message:error
    })
  }
  
};
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    console.log(tours,"gettours")
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
exports.getTour = async(req, res) => {
  try{
    const tour = await Tour.findById(req.params.id)
    res.status(200).json({
      status:'success',
      data:{
        tour
      }
    })
  }catch(error){
    res.status(400).json({
       status:'fail',
       message:error
    })
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
      message: 'Invalid data sent',
    });
  }

  const newTour = await Tour.create(req.body);
  // res.send('Done')
};
exports.deleteTour = async(req, res) => {
  try{
    await Tour.findByIdAndDelete(req.params.id)
    res.status(201).json({});
  }catch(error){
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};
