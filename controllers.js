const Raffle = require("./schemas/raffle")
const Ticket = require("./schemas/ticket")

async function createRaffle(req, res) {
  try {
    if (!(req.body.from && req.body.to && req.body.name)) {
      res.status(422).json({ error: "Missing parameters" })
      return
    }
    if (req.body.to - req.body.from < 0) {
      res.status(422).json({ error: "Invalid parameters" })
      return
    }
    const raffle = new Raffle({
      name: req.body.name,
      closed: false,
      ticketsAvailable: req.body.to - req.body.from + 1,
    })
    await raffle.save()
    for (let i = req.body.from; i <= req.body.to; i++) {
      const ticket = new Ticket({
        number: i,
        available: true,
        raffle: raffle,
      })
      await ticket.save()
    }

    res.status(200).json({ message: "Raffle created successfully" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "500 server error" })
  }
}

async function getRaffles(req, res) {
  try {
    const raffles = await Raffle.find({}, { __v: 0 })
    //res.status(200).json(raffles)
    var answer = []
    for (let i = 0; i < raffles.length; i++) {
      let raff = raffles[i]
      if (raff.closed) {
        const winner = await Ticket.findById(raff.winner)
        answer.push({
          name: raff.name,
          closed: raff.closed,
          winner: {
            ticket: winner.number,
            email: winner.email,
            name: winner.name,
            phone: winner.phone,
          },
        })
      } else {
        const available = await Ticket.find({
          raffle: raff._id,
          available: true,
        })
        answer.push({
          name: raffles[i].name,
          closed: raffles[i].closed,
          ticketsAvailable: available.length,
        })
      }
    }
    res.status(200).json(answer)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "500 server error" })
  }
}

async function getRaffleById(req, res) {
  try {
    const raff = await Raffle.findById({ _id: req.params.id })
    const tickets = await Ticket.find({ raffle: raff._id }, { __v: 0, _id: 0 })
    var jRaff = JSON.parse(JSON.stringify(raff))
    jRaff["tickets"] = JSON.parse(JSON.stringify(tickets))
    res.status(200).json(jRaff)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "500 server error" })
  }
}

async function buyTicket(req, res) {
  try {
    if (
      !(
        req.params.id &&
        req.body.number &&
        req.body.name &&
        req.body.email &&
        req.body.phone
      )
    ) {
      res.status(422).json({ error: " 422 Unprocessable Entity" })
      return
    }
    const ticket = await Ticket.find({
      raffle: req.params.id,
      number: req.body.number,
    })

    if (ticket.length === 0) {
      res.status(404).json({ error: "404 not found" })
      return
    }
    if (!ticket[0].available) {
      res.status(409).json({ error: "409 conflict" })
      return
    }
    await Ticket.updateOne(
      {
        raffle: req.params.id,
        number: req.body.number,
      },
      {
        email: req.body.email,
        name: req.body.name,
        phone: req.body.phone,
        available: false,
      }
    )
    res.status(200).json({ message: "Ticket changed successfully" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "500 server error" })
  }
}

async function getWinner(req, res) {
  try {
    const raff = await Raffle.findById({ _id: req.params.id })
    if (!raff) {
      res.status(200).json({ awarded: false })
      return
    }
    const tickets = await Ticket.find({ raffle: raff._id, available: false })
    if (tickets.length === 0) {
      res.status(200).json({ awarded: false })
      return
    }
    if (raff.closed) {
      res.status(409).json({ message: "Raffle was closed" })
      return
    }
    const pos = Math.floor(Math.random() * tickets.length)
    await Raffle.findOneAndUpdate(
      { _id: req.params.id },
      {
        closed: true,
        winner: tickets[pos]._id,
      }
    )
    res.status(200).json({
      awarded: true,
      email: tickets[pos].email,
      name: tickets[pos].name,
      phone: tickets[pos].phone,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "500 server error" })
  }
}

module.exports = {
  getRaffles,
  createRaffle,
  getRaffleById,
  buyTicket,
  getWinner,
}
