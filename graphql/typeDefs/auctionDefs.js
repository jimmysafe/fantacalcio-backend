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

    type AuctionRules {
        goalkeepers: Int!
        defenders: Int!
        midfielders: Int!
        strikers: Int!
    }

    type Auction {
        _id: ID!
        nickName: String!
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
        rules: AuctionRules!
    }

    input AuctionCreate {
        userId: ID!
        nickName: String!
        rules: AuctionRulesInput!
    }

    input AuctionRulesInput {
        goalkeepers: Int!,
        defenders: Int!,
        midfielders: Int!,
        strikers: Int!
    }

    extend type Subscription {
        auction(auction: String!): Auction
    }
    
    extend type Query {
        auctions: [Auction]
        auction(auctionName: String!): Auction
    }

    extend type Mutation {
        createAuction(input: AuctionCreate!): Auction
        createBid(auctionId: ID!, userId: ID!, bidAmount: Int!): Bid
        updateAuctionStatus(auctionId: ID!, newStatus: String!): Auction
        updateAuctionUserTurn(auctionId: ID!, userId: ID!): Auction
        updateAuctionPlayer(auctionId: ID!, playerId: ID!): Player
        closeBidOffer(auctionId: ID!, playerId: ID!): Auction
        deleteAuctions: String
    }
`