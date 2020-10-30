const Auction = require('../../schema/Auction')
const User = require('../../schema/User')
const { uniqueNamesGenerator, adjectives, colors } = require('unique-names-generator');


const auctionResolver = {
    Query: {
        auctions: async() => {
            const auctions = await Auction.find().populate(['users', 'owner'])
            return auctions
        },

        auction: async(_, args) => {
            const auction = await Auction.find({ _id: args.auctionId }).populate(['users', 'owner'])
            return auction
        }
    },

    Mutation: {
        createAuction: async(_, args) => {
            try {
                const auctionName = uniqueNamesGenerator({ dictionaries: [adjectives, colors] });
                const newUser = new User({
                    name: args.userName,
                    ready: true,
                    auction: auctionName
                })

                const owner = await newUser.save()

                const newAuction = new Auction({
                    name: auctionName,
                    status: 'pending',
                    owner
                })
                
                newAuction.users.push(owner)

                const savedAuction = await newAuction.save()

                return savedAuction

            } catch(err) {
                throw err
            }
        },

        updateAuctionStatus: async(_, args, { pubsub }) => {
            try {
                const auction = await Auction.findOne({ _id: args.auctionId })
                auction.status = args.newStatus
                await auction.save()
                pubsub.publish(`auction_${auction.name}`, { auction })
                return auction
            } catch(err) {
                throw err
            }
        }
    },

    Subscription: {
        auction: {
            subscribe: async(_, args, { pubsub }) =>  {
            return pubsub.asyncIterator(`auction_${args.auction}`)
            }
        }
    }
};

module.exports = auctionResolver