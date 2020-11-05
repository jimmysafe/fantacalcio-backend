module.exports = `
    type Bid {
        from: User!
        bid: Int!
    }

    type AuctionUserPlayers {
        player: Player!
        amount_paid: Int!
    }

    type AuctionUser {
        _id: ID!
        nickName: String!
        players: [AuctionUserPlayers]
        ready: Boolean
        credits: Int
    }

    type Auction {
        _id: ID!
        name: String!
        status: String!
        owner: User
        turnOf: User
        users: [AuctionUser]
        bidPlayer: Player
        bids: [Bid]
        userCredits: Int
        timer: Boolean
        chosenPlayers: [String!]
    }

    type PlayerAllocations {
        P: Boolean,
        D: Boolean,
        C: Boolean,
        A: Boolean
    }

    extend type Subscription {
        auction(auction: String!): Auction
    }
    
    extend type Query {
        auctions: [Auction]
        auction(auctionName: String!): Auction
        auctionUserPlayersAllocation(auctionId: ID!): PlayerAllocations
    }

    extend type Mutation {
        createAuction(userId: ID!): Auction
        createBid(auctionId: ID!, userId: ID!, bidAmount: Int!): Bid
        updateAuctionStatus(auctionId: ID!, newStatus: String!): Auction
        updateAuctionUserTurn(auctionId: ID!, userId: ID!): Auction
        updateAuctionPlayer(auctionId: ID!, playerId: ID!): Player
        closeBidOffer(auctionId: ID!, playerId: ID!): Auction
        deleteAuctions: String
    }
`