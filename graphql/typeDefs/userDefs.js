module.exports = `
    type User {
        _id: ID!
        auctions: [Auction]
        nickName: String!
        password: String!
        email: String!
        players: [UserPlayers]
        credits: [UserCredits]
        ready: Boolean
    }

    type UserPlayers {
        player: Player
        auction: Auction
        amount_paid: Int
    }

    type UserCredits {
        amount: Int
        auction: Auction
    }

    type AuthData {
        userId: ID!
        token: String!
    }

    input RegisterUserInput {
        nickName: String!
        password: String!
        email: String!
    }

    extend type Subscription {
        auctionUsers(auction: String!): [User]
    }

    extend type Query {
        users: [User]
        user(userId: ID!): User
    }

    extend type Mutation {
        createUser(input: RegisterUserInput!): User
        loginUser(email: String!, password: String!): AuthData
        associateUserToAuction(userId: ID!, inviteCode: String!): Auction
        changeUserReadiness(userId: ID!, auctionName: String!) : User
        deleteAllUsers: String
    }
`