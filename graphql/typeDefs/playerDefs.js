module.exports = `
    type Player {
        _id: ID!
        name: String!
        role: String!
        team: String!
        paid: Int
    }

    extend type Query {
        players: [Player]
    }

    extend type Mutation {
        createPlayer(name: String!, role: String!, team: String!): Player
    }
`