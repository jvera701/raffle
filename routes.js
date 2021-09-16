const express = require("express")

const controllers = require("./controllers")
const app = express.Router()

app.post("/raffles", controllers.createRaffle)
app.get("/raffles", controllers.getRaffles)
app.get("/raffles/:id", controllers.getRaffleById)
app.post("/raffles/:id/tickets", controllers.buyTicket)
app.post("/raffles/:id/play", controllers.getWinner)

module.exports = app
