const User = require('../../schema/User')
const Auction = require('../../schema/Auction')


const userResolver = {
    Query: {
      users: async() => {
        const users = await User.find()
        return users
      },

      auctionUsers: async(_, args) => {
        const users = await User.find({ auction: args.auction })
        return users
      }
    },

    Mutation: {
      createUser: async(_, args, { pubsub }) => {
        try {
          const newUser = new User({
            name: args.name,
            ready: false,
            auction: args.inviteCode
          })

          const savedUser = await newUser.save()

          const auction = await Auction.findOne({ name: args.inviteCode }).populate('users')

          auction.users.push(savedUser)

          await auction.save()

          pubsub.publish(`users_${auction.name}`, { users: auction.users })

          return savedUser

        } catch(err) {
          throw err
        }
      },

      changeUserReadiness: async(_, args, { pubsub }) => {
        try {
          const user = await User.findOne({ _id: args.userId })          
          user.ready = !user.ready
          await user.save()

          const allUsers = await User.find({ auction: user.auction })

          pubsub.publish(`users_${user.auction}`, { users: allUsers })

          return user

        } catch(err) {
          throw err
        }
      },

      deleteAllUsers: async(_, __) => {
        await User.deleteMany()
        return 'All users have been deleted.'
      }
    },

    Subscription: {
      users: {
        subscribe: async(_, args, { pubsub }) =>  {
          return pubsub.asyncIterator(`users_${args.auction}`)
        }
      }
    }
};

module.exports = userResolver