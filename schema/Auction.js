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
        ref: 'user',
        autopopulate: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
        autopopulate: true
    }],
    turnOf: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        autopopulate: true
    }

})

AuctionSchema.plugin(require('mongoose-autopopulate'));

const Auction = mongoose.model('auction', AuctionSchema)

module.exports = Auction