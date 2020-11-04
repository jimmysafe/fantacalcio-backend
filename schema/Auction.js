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
    },
    bidPlayer: {
        type: Schema.Types.ObjectId,
        ref: 'player'    
    },

    bids: [{
        from: {
            type: Schema.Types.ObjectId,
            ref: 'user'  
        },
        bid: Number
    }],

    chosenPlayers: [String],

    timer: Boolean,
    
    userCredits: Number
})


const Auction = mongoose.model('auction', AuctionSchema)

module.exports = Auction