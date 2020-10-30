module.exports = `
    type Auction {
        _id: ID!
        name: String!
        status: String!
        owner: User
        users: [User]
    }

    extend type Subscription {
        auction(auction: String!): Auction
    }
    
    extend type Query {
        auctions: [Auction]
        auction(auctionId: ID!): Auction
    }

    extend type Mutation {
        createAuction(userName: String!): Auction
        updateAuctionStatus(auctionId: ID!, newStatus: String!): Auction
    }
`