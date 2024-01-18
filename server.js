const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
dotenv.config({ path: './config.env' });

const DB = "mongodb+srv://kompellauday9:uday@cluster0.kp5pxnf.mongodb.net/NATOURS"

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true 
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('db connection successful');
  });


// console.log(process.env);
const port = 4000;

app.listen(port, () => {
  console.log(`App runing on port ${port}`);
});
