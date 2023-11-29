const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Tour = require('./../../models/TourModel')
const fs = require('fs')

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log(con.connections);
    console.log('db connection successful');
  });
  const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'))

  //import data into db
  const importData = async() =>{
     try{
       await Tour.create(tours)
       console.log('Data successfully loaded')
       process.exit()
    }catch(error){
        console.log(error)
     }
  }
//import data into db
const deleteData = async() => {
    try{
      await Tour.deleteMany()
      console.log('Data succesfully deleted')
      process.exit()
    }catch(error){

    }
}
console.log(process.argv)

if(process.argv[2] == '--import'){
    importData()
}else if(process.argv[2] == '--delete'){
    deleteData()
}