const express = require('express');
const fs = require('fs');
const app = express();

const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');

app.use(express.json()); /// this is a middleware which is used to parse the request recieved from the client
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter); // This acts as a middleware that is when new request hits it goes into middleware stack
app.use('api/v1/users', userRouter);

module.exports = app;
