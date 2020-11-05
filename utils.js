const playerResolver = require("./graphql/resolvers/player")

const auctionPopulate = [
    'owner', 
    'turnOf', 
    'bidPlayer', 
    'bids.from',
    'users.players.player'
]

const userPopulate = [
    'auctions'
]

module.exports = {
    auctionPopulate,
    userPopulate
}

