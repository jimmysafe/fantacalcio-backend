const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const User = require('../../schema/User')
const Auction = require('../../schema/Auction')
const { auctionPopulate, userPopulate } = require('../../utils');
const { AuthenticationError } = require('apollo-server');


const userResolver = {
    Query: {
      users: async() => {
        const users = await User.find().populate(userPopulate)
        return users
      },

      user: async(_, args) => {
        const user = await User.findOne({ _id: args.userId }).populate(userPopulate)
        return user
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

          const token = jwt.sign({ userId: user._id, email: user.email }, 'somesupersecretkey', { expiresIn: '1d' })

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
          const auction = await Auction.findOne({ name: args.inviteCode }).populate(auctionPopulate)
          if(!auction) throw new Error('Asta non trovata.')

          const user = await User.findOne({ _id: args.userId }).populate(userPopulate)
          if(!user) throw new Error('Utente non trovato.')
          
          user.auctions.push(auction)

          await user.save()

          auction.users.push({
            _id: user._id,
            nickName: user.nickName,
            players: [],
            credits: 500,
            ready: false
          })

          await auction.save()

          pubsub.publish(`auction_${auction.name}`, { auction })

          return auction

        } catch(err) {
          throw err
        }
      },

      changeUserReadiness: async(_, args, { pubsub }) => {
        try {
          const auction = await Auction.findOne({ name: args.auctionName }).populate(auctionPopulate)
          
          const userIndex = auction.users.map(x => x._id).indexOf(args.userId)


          auction.users[userIndex].ready = !auction.users[userIndex].ready
          await auction.save()

          pubsub.publish(`auction_${auction.name}`, { auction })
          
          return auction

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
          const auction = await Auction.findOne({ name: args.auction }).populate(auctionPopulate)
          setTimeout(() => pubsub.publish(`users_${args.auction}`, { auctionUsers: auction.users }), 0)
          return pubsub.asyncIterator(`users_${args.auction}`)
        }
      }
    }
};

module.exports = userResolver