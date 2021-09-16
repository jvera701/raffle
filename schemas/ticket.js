const mongoose = require("mongoose")

const ticketSchema = mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  name: String,
  email: String,
  phone: String,
  available: {
    type: Boolean,
    required: true,
  },
  raffle: {
    ref: "Raffle",
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
})

const Ticket = mongoose.model("Ticket", ticketSchema)
module.exports = Ticket
