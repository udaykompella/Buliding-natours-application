const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json()); /// this is a middleware which is used to parse the request recieved from the client
app.use((req,res,next)=>{
    console.log("Hello from the middleware")
    next()
})
app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString()
    next()
})
// app.get('/',(req,res)=>{
//     res.status(200).json({message:"Hello from server side!",app:'Natours'})
// })

// app.post('/',(req,res)=>{
//     res.status(200).json({message:"you can post to this endpoint"})
// })
const updateTour = (req, res) => {
  const id = req.params.id * 1;
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: "Couldn't find the tour with the requested id",
    });
  }
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tour: 'Update tour here... ',
    },
  });
};
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};
const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  if (req.params.id > tours.length) {
    res.status(404).json({
      status: 'failed',
      message: "Couldn't find the tour with the requested id",
    });
  } else {
    const tour = tours.find((el) => el.id === id);
    // console.log(tour)
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  }
};
const createTour = (req, res) => {
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
const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid Id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: null,
  });
};
const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`));
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.patch('/api/v1/tours/:id', deleteTour);
const getAllUsers = (req,res) =>{
    res.status(500).json({
        status:"err",
        message:'Route is not yet implemented'
    })
}
const getUser = (req,res) =>{
    res.status(500).json({
        status:"err",
        message:'Route is not yet implemented'
    })
}
const createUser = (req,res) =>{
    res.status(500).json({
        status:"err",
        message:'Route is not yet implemented'
    })
}
const updateUser = (req,res) =>{
    res.status(500).json({
        status:"err",
        message:'Route is not yet implemented'
    })
}
const deleteUser = (req,res) =>{
    res.status(500).json({
        status:"err",
        message:'Route is not yet implemented'
    })
}


app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser)
app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser)

const port = 3000;

app.listen(port, () => {
  console.log(`App runing on port ${port}`);
});
