module.exports = `
    type Player {
        name: String
        role: String
    }

    extend type Query {
        players: [Player]
    }
`