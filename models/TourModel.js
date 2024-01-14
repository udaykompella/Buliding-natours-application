const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      minlength: [10,'A tour name must have less or equal 10 characters'],
      maxlength: [40,'A tour name must have more or equal 40 characters']
    },
    // slug : String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a magroupsize"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum:{
        values:['easy', 'medium', 'difficult'],
        message:'Difficulty is either: easy,medium,difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min:[1,'Rating must be above 1.0'],
      max:[5,'Rating must be above 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have image cover"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secrettour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//Document middlewaare: works only on create and save
tourSchema.pre("save", function (next) {s
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secrettour: { $ne: true } });
  this.start = Date.now()
  next();
});
tourSchema.post(/^find/, function(docs,next){
  console.log(`Query took ${Date.now() - this.start } milliseconds`)
  // console.log(docs)
  next()
})


//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next){
 this.pipeline().unshift({$match : { secrettour : {$ne : true}}})
  console.log(this.pipeline())
  next()
})
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
