const Player = require('../../schema/Player')

const playerResolver = {
    Query: {
      players: async() => {
        try {
          const players = await Player.find()
          return players
        } catch(err) {
          throw err
        }
      },
    },

    Mutation: {
      createPlayer: async(_, args) => {
        try {
          const player = new Player({
            name: args.name,
            role: args.role,
            team: args.team
          })

          await player.save()

          return player

        } catch (err) {
          throw err
        }
      }
    }
};

module.exports = playerResolver