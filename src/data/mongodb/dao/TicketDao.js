const { default: mongoose } = require("mongoose");
const { TicketModel } = require("../models/TicketModel");
const TicketDto = require("../../../dtos/TicketDto");

class TicketDao {
    async createTicket({ amount, purchaser }) {
        const ticket = await TicketModel.create({
            code: new mongoose.Types.ObjectId().toString(),
            amount,
            purchaser
        })

        return new TicketDto({
            code: ticket.code,
            purchase_datetime: ticket.purchase_datetime,
            amount: ticket.amount,
            purchaser: ticket.purchaser
        })
    }
}

module.exports = TicketDao;