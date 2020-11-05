const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AuctionSchema = new Schema({
    nickName: {
        type: String,
        required: true
    },
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
        nickName: {
            type: String,
            required: true
        },
        players : [{
            player: {
                type: Schema.Types.ObjectId,
                ref: 'player'
            },
            amount_paid: {
                type: Number,
                required: true
            }
        }
    ],
        credits: Number,
        ready: Boolean
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

    rules: {
        goalkeepers: Number,
        defenders: Number,
        midfielders: Number,
        strikers: Number
    },

    chosenPlayers: [String],

    timer: Boolean,
    
    userCredits: Number
})


const Auction = mongoose.model('auction', AuctionSchema)

module.exports = Auction