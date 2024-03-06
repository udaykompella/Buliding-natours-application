class apiFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      let queryObj = { ...this.queryString };
  
      let excludedFields = ["page", "limit", "sort", "fields"];
  
      excludedFields.forEach((el) => delete queryObj[el]);
  
      //2) Advance Filtering
      let queryString = JSON.stringify(queryObj);
      queryString = queryString.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
  
      // console.log(JSON.parse(queryString));
  
      this.query = this.query.find(JSON.parse(queryString));
  
      return this;
    }
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(",").join(" "); //here we used split and join because if we want to sort by multiple keys like price and ratingsaverage we need to seperate them and join
        // console.log(sortBy, "sortBy");
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort("-createdAt");
      }
  
      return this;
    }
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(",").join(" ");
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select("-__v");
      }
  
      return this;
    }
    paginate() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString * 1 || 100;
      const skip = (page - 1) * limit;
      //page=3&limit=10,1-10,page1, 11-20,page2, 21-30 page3
  
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
  }

  module.exports = apiFeatures