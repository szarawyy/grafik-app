const { mongoose } = require("mongoose")

const termSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['available', 'blocked', 'reserved', 'ordered'],
        required: true
    }
})

module.exports = mongoose.model('Term', termSchema)