module.exports = `
    type User {
        _id: ID!
        ready: Boolean
        auction: String!
        name: String!
    }

    extend type Subscription {
        users(auction: String!): [User]
    }

    extend type Query {
        users: [User]
        auctionUsers(auction: String!): [User]
    }

    extend type Mutation {
        createUser(name: String!, inviteCode: String!): User
        changeUserReadiness(userId: ID!) : User
        deleteAllUsers: String
    }
`