const express = require('express')
const fs = require('fs')
const app = express()

app.use(express.json()) /// this is a middleware which is used to parse the request recieved from the client

// app.get('/',(req,res)=>{
//     res.status(200).json({message:"Hello from server side!",app:'Natours'})
// })

// app.post('/',(req,res)=>{
//     res.status(200).json({message:"you can post to this endpoint"})
// })
const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`))
app.get('/api/v1/tours',(req,res)=>{
    res.status(200).json({
        status:"success",
        results:tours.length,
        data:{
            tours
        }
    })
})
app.post('/api/v1/tours',(req,res)=>{
    console.log(req.body)
    /// Inorder to post the req.body to the existing json file we have to create new object with new id since we dont have db 
    const newId = tours[tours.length -1].id + 1; 
    console.log(newId,"new")
    const newTour = Object.assign({id:newId},req.body) // this statement is to add extra object without modifying it
    tours.push(newTour)
    fs.writeFile(`./dev-data/data/tours-simple.json`,JSON.stringify(tours),err=>{
        res.status(201).json({
            status:'success',
            data:{
                tour:newTour
            }
        })
    })
    // res.send('Done')
})
const port = 3000

app.listen(port,()=>{
    console.log(`App runing on port ${port}`)
})