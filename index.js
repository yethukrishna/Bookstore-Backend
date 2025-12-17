// import dotenv file
require("dotenv").config()

// import express library
const express = require("express")

// import cors
const cors = require("cors")

// import route
const route = require("./routes/routes")

// import DB file
require('./dBConnection')

// import middleware
// const jwtMiddleware = require("./middleware/jwtMiddleware")

// create the server - express()
const bookstoreServer = express()

// server using cors
bookstoreServer.use(cors())
bookstoreServer.use(express.json()) // parse json - middleware
// bookstoreServer.use(appMiddleware)
bookstoreServer.use(route)

// export the uploads folder from server
bookstoreServer.use('/upload',express.static("./uploads"))

// create port
PORT = 4000 || process.env.PORT

bookstoreServer.listen(PORT, ()=>{
    console.log(`server running in ${PORT}`);
    
})

bookstoreServer.get("/",(req,res)=>{
    res.status(200).send("<h1>BOOKSTORE Server Started!!!</h1>")
})