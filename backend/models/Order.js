const { mongoose } = require("mongoose")
const AutoIncrement = require('mongoose-sequence')(mongoose)

const orderSchema = new mongoose.Schema({
    description: {
        type: String
    },
    term: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Term'
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    apartmentNumber: {
        type: String
    },
    modifiedAt: {
        type: Date,
        default: () => Date.now()
    },
    modifiedBy: {
        type: String,
        required: true
    }
})

orderSchema.pre('save', function(next) {
    this.modifiedAt = Date.now()
    next()
})

orderSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 100
})

module.exports = mongoose.model('Order', orderSchema)