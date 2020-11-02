const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PlayerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    team: {
        type: String,
        required: true
    },
    paid: Number
})


const Player = mongoose.model('player', PlayerSchema)

module.exports = Player