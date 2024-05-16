const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    },
    {
        virtual: {
            id: {
                get() {
                    this._id.toString()
                }
            }
        }
    }
)

module.exports = mongoose.model('Message', schema, 'messages')