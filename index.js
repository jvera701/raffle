const mongoose = require("mongoose")
const express = require("express")
const app = express()
const routes = require("./routes")
const cors = require("cors")

app.use(cors())
app.use(express.json())
app.use(routes)

const uri =
  "mongodb+srv://admin:6WVRyi32sH07FLUE@cluster0.ar9yp.mongodb.net/raffle?retryWrites=true&w=majority"

mongoose.connect(uri, { useNewUrlParser: true })
const connection = mongoose.connection
connection.once("open", () => {
  console.log("MongoDB database connection established successfully")
})

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).json({ error: err.message })
})

app.listen(3001, () => console.log("Server running ..."))
