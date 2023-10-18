 const fs = require('fs');

exports.checkId = (req,res,next,val) =>{
  const id = req.params.id * 1;
  console.log(`Tour id is ${val}`)
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: "Couldn't find the tour with the requested id",
    });
  }
  next()
}
exports.checkBody = (req,res,next)=>{
   if(!req.body.name || !req.body.price){
      res.status(400).json({
         status:"fail",
         message:"Missing name and price"
      })
   }
   else{
      next()
   }
}
const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`));
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tour: 'Update tour here... ',
    },
  });
};
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};
exports.getTour = (req, res) => {
    const tour = tours.find((el) => el.id === id);
    // console.log(tour)
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      }
    });
  
};
exports.createTour = (req, res) => {
  console.log(req.body);
  /// Inorder to post the req.body to the existing json file we have to create new object with new id since we dont have db
  const newId = tours[tours.length - 1].id + 1;
  console.log(newId, 'new');
  const newTour = Object.assign({ id: newId }, req.body); // this statement is to add extra object without modifying it
  tours.push(newTour);
  fs.writeFile(
    `./dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
  // res.send('Done')
};
exports.deleteTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: null,
  });
};
