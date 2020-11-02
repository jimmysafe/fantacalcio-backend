const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AuctionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    turnOf: {
        type: Schema.Types.ObjectId,
        ref: 'user'    
    }

})


const Auction = mongoose.model('auction', AuctionSchema)

module.exports = Auction