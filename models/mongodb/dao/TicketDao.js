const { default: mongoose } = require("mongoose");
const TicketModel = require("../schemas/ticket");

class TicketDao {
    async createTicket({ amount, purchaser }) {
        const ticket = await TicketModel.create({
            code: new mongoose.Types.ObjectId().toString(),
            amount,
            purchaser
        })
        return ticket
    }
}

module.exports = TicketDao;