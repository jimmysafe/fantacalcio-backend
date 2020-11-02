const auctionPopulate = [
    'owner', 
    'users', 
    'turnOf', 
    'bidPlayer', 
    'bids.from'
]

const userPopulate = [
    'auctions', 
    'players.player'
]

module.exports = {
    auctionPopulate,
    userPopulate
}

