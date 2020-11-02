const Auction = require('../../schema/Auction')
const User = require('../../schema/User')
const { uniqueNamesGenerator, adjectives, colors } = require('unique-names-generator');


const auctionResolver = {
    Query: {
        auctions: async() => {
            const auctions = await Auction.find().populate(['owner', 'users', 'turnOf'])
            return auctions
        },

        auction: async(_, args) => {
            const auction = await Auction.findOne({ name: args.auctionName }).populate(['owner', 'users', 'turnOf'])
            return auction
        }
    },

    Mutation: {
        createAuction: async(_, args) => {
            try {
                const auctionName = uniqueNamesGenerator({ dictionaries: [adjectives, colors] });
                const user = await User.findOne({ _id: args.userId }).populate('auctions')
                if(!user) throw new Error('Utente non trovato.')

                const newAuction = new Auction({
                    name: auctionName,
                    status: 'pending',
                    owner: user,
                    turnOf: user
                })

                newAuction.users.push(user)
                const savedAuction = await newAuction.save()

                user.auctions.push(savedAuction)
                await user.save()

                return savedAuction

            } catch(err) {
                console.log(err)
                throw err
            }
        },

        updateAuctionStatus: async(_, args, { pubsub }) => {
            try {
                const auction = await Auction.findOne({ _id: args.auctionId }).populate(['owner', 'users', 'turnOf'])
                auction.status = args.newStatus
                await auction.save()
                pubsub.publish(`auction_${auction.name}`, { auction })
                return auction
            } catch(err) {
                throw err
            }
        },

        updateAuctionUserTurn: async(_, args, { pubsub }) => {
            try {
                const auction = await Auction.findOne({ _id: args.auctionId }).populate(['owner', 'users', 'turnOf'])
                const user = await User.findOne({ _id: args.userId })
                auction.turnOf = user
                await auction.save()
                pubsub.publish(`auction_${auction.name}`, { auction })
                return auction

            } catch(err) {
                throw err
            }
        },

        deleteAuctions: async() => {
            await Auction.deleteMany()
            return 'deleted all auctions'
        }
    },

    Subscription: {
        auction: {
            subscribe: async(_, args, { pubsub }) => {
                const auction = await Auction.findOne({ name: args.auction }).populate(['owner', 'users', 'turnOf'])
                setTimeout(() => pubsub.publish(`auction_${args.auction}`, { auction }), 0)
                return pubsub.asyncIterator(`auction_${args.auction}`)
            }
        }
    }
};

module.exports = auctionResolver