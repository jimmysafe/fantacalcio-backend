module.exports = `
    type Auction {
        _id: ID!
        name: String!
        status: String!
        owner: User
        turnOf: User
        users: [User]
    }

    extend type Subscription {
        auction(auction: String!): Auction
    }
    
    extend type Query {
        auctions: [Auction]
        auction(auctionName: String!): Auction
    }

    extend type Mutation {
        createAuction(userId: ID!): Auction
        updateAuctionStatus(auctionId: ID!, newStatus: String!): Auction
        updateAuctionUserTurn(auctionId: ID!, userId: ID!): Auction
        deleteAuctions: String
    }
`