const mongoose = require("mongoose")

const raffleSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  closed: {
    type: Boolean,
    required: true,
  },

  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
  },
})
const Raffle = mongoose.model("Raffle", raffleSchema)
module.exports = Raffle
