const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
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
      createUser: async(_, args) => {
        try {
          const existingUser = await User.findOne({ email: args.input.email })

          if(existingUser){
            throw new Error('User already exists.')
          }

          const hashedPassword = await bcrypt.hash(args.input.password, 10)

          const newUser = new User({
            nickName: args.input.nickName,
            email: args.input.email,
            password: hashedPassword
          })

          const savedUser = await newUser.save()

          return savedUser

        } catch(err) {
          throw err
        }
      },

      loginUser: async(_, args) => {
        try { 
          const user = await User.findOne({ email: args.email })
          
          if(!user) throw new Error('Utente non esiste.')

          const passwordMatch = await bcrypt.compare(args.password, user.password)
          
          if(!passwordMatch) throw new Error('Email o Password errati.')

          const token = jwt.sign({ userId: user._id, email: user.email }, 'somesupersecretkey', { expiresIn: '10h' })

          return { 
            userId: user.id, 
            token 
          }

        } catch(err) {
          throw err
        }
      },

      associateUserToAuction: async(_, args, { pubsub }) => {
        try {
          const auction = await Auction.findOne({ name: args.inviteCode })
          if(!auction) throw new Error('Asta non trovata.')

          const user = await User.findOne({ _id: args.userId })
          if(!user) throw new Error('Utente non trovato.')
          
          user.ready = false
          user.auctions.push(auction)
          await user.save()

          auction.users.push(user)
          await auction.save()

          pubsub.publish(`users_${auction.name}`, { auctionUsers: auction.users })

          return user

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

          pubsub.publish(`users_${user.auction}`, { auctionUsers: allUsers })

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
      auctionUsers: {
        subscribe: async(_, args, { pubsub }) =>  {
          const auction = await Auction.findOne({ name: args.auction }).populate(['owner', 'users'])
          setTimeout(() => pubsub.publish(`users_${args.auction}`, { auctionUsers: auction.users }), 0)
          return pubsub.asyncIterator(`users_${args.auction}`)
        }
      }
    }
};

module.exports = userResolver