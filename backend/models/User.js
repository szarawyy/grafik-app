const { mongoose } = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        fName: String,
        lName: String
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        default: "fitter",
        enum: ['fitter', 'viewer', 'editor', 'admin'],
        required: false
    }]
})

module.exports = mongoose.model('User', userSchema)