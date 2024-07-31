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

        return new TicketDto(
            ticket.code,
            ticket.purchase_datetime,
            ticket.amount,
            ticket.purchaser
        )
    }
}

module.exports = TicketDao;