const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
    },
    duration:{
      type:Number,
      required:[true, 'A tour must have a duration'],
    },
    maxGroupSize:{
      type:Number,
      required:[true, 'A tour must have a magroupsize']
    },
    difficulty:{
      type:String,
      required:[true,'A tour must have a difficulty']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity:{
      type:Number,
      default:4.5
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount:Number,
    summary:{
      type:String,
      trim:true,
      required:[true,'A tour must have summary']
    },
    description:{
      type:String,
      trim:true
    },
    imageCover:{
      type:String,
      required:[true,"A tour must have image cover"]
    },
    images:[String],
    createdAt:{
      type:Date,
      default:Date.now()
    },
    startDates:[Date]
  },
  {
    toJSON : { virtuals : true},
    toObject : { virtuals :  true}
  }
  
  );

  tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7
  });
  
  const Tour = mongoose.model('Tour', tourSchema);

  module.exports = Tour