module.exports = `
    type User {
        _id: ID!
        auctions: [Auction]
        nickName: String!
        password: String!
        email: String!
        ready: Boolean
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
        auctionUsers(auction: String!): [User]
    }

    extend type Mutation {
        createUser(input: RegisterUserInput!): User
        loginUser(email: String!, password: String!): AuthData
        associateUserToAuction(userId: ID!, inviteCode: String!): User
        changeUserReadiness(userId: ID!) : User
        deleteAllUsers: String
    }
`