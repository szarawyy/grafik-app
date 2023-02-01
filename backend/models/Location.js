const { mongoose } = require("mongoose")

const locationSchema = new mongoose.Schema({
    abbrev: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    address: {
        streetName: {
            type: String,
            required: true
        },
        buildingNumber: {
            type: String,
            required: true
        },
        cityName: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        }
    }
})

module.exports = mongoose.model('Location', locationSchema)