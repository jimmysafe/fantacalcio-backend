const auctionPopulate = [
    'owner', 
    'turnOf', 
    'bidPlayer', 
    'bids.from',
    {
        path: 'users',
        populate: {
          path: 'players.player'
        } 
    },
    {
        path: 'users',
        populate: {
          path: 'players.auction'
        } 
    },
    {
        path: 'users',
        populate: {
          path: 'credits.auction'
        } 
    },
]

const userPopulate = [
    'auctions', 
    'players.player',
    'players.player.auction',
    'credits.auction',
]

module.exports = {
    auctionPopulate,
    userPopulate
}

