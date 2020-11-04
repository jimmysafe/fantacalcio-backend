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
        goalkeepers: [Player]
        defenders: [Player]
        midfielders: [Player]
        strikers: [Player]
    }

    extend type Mutation {
        addAllSeasonPlayers: String!
    }
`