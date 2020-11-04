const Auction = require('../../schema/Auction')
const User = require('../../schema/User')
const Player = require('../../schema/Player')
const { uniqueNamesGenerator, adjectives, colors } = require('unique-names-generator');
const { auctionPopulate, userPopulate } = require('../../utils')

const auctionResolver = {
    Query: {
        auctions: async() => {
            const auctions = await Auction.find().populate(auctionPopulate)
            return auctions
        },

        auction: async(_, args) => {
            const auction = await Auction.findOne({ name: args.auctionName }).populate(auctionPopulate)
            return auction
        }
    },

    Mutation: {
        createAuction: async(_, args) => {
            try {
                const auctionName = uniqueNamesGenerator({ dictionaries: [adjectives, colors] });
                const user = await User.findOne({ _id: args.userId }).populate(userPopulate)
                if(!user) throw new Error('Utente non trovato.')

                const newAuction = new Auction({
                    name: auctionName,
                    status: 'pending',
                    owner: user,
                    turnOf: user,
                    bidPlayer: null,
                    bids: [],
                    userCredits: 500,
                    timer: false
                })

                newAuction.users.push(user)
                const savedAuction = await newAuction.save()

                user.auctions.push(savedAuction)
                user.credits.push({
                    amount: savedAuction.userCredits,
                    auction: savedAuction
                })
                await user.save()

                return savedAuction

            } catch(err) {
                console.log(err)
                throw err
            }
        },

        updateAuctionStatus: async(_, args, { pubsub }) => {
            try {
                const auction = await Auction.findOne({ _id: args.auctionId }).populate(auctionPopulate)
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
                const auction = await Auction.findOne({ _id: args.auctionId }).populate(auctionPopulate)
                const user = await User.findOne({ _id: args.userId })
                auction.turnOf = user
                auction.timer = false
                await auction.save()
                pubsub.publish(`auction_${auction.name}`, { auction })
                return auction

            } catch(err) {
                throw err
            }
        },

        updateAuctionPlayer: async(_, args, { pubsub }) => {
            try {
                const player = await Player.findOne({ _id: args.playerId })
                if(!player) throw new Error("Player not found")
                const auction = await Auction.findOne({ _id: args.auctionId }).populate(auctionPopulate)
                if(!auction) throw new Error("Auction not found")

                auction.bidPlayer = player
                auction.timer = false
                await auction.save()

                pubsub.publish(`auction_${auction.name}`, { auction })

                return player

            } catch(err) {
                throw err
            }
        },

        createBid: async(_, args, { pubsub }) => {
            try {
                const user = await User.findOne({ _id: args.userId }).populate(userPopulate)
                const auction = await Auction.findOne({ _id: args.auctionId }).populate(auctionPopulate)
            
                const newBid = {
                    from: user,
                    bid: args.bidAmount
                }

                auction.bids.push(newBid)
                auction.timer = true
                await auction.save()

                pubsub.publish(`auction_${auction.name}`, { auction })

                return newBid

            } catch(err) {
                console.log(err)
                throw err
            }
        },

        closeBidOffer: async(_, args, { pubsub }) => {
            try {
                const auction = await Auction.findOne({ _id: args.auctionId }).populate(auctionPopulate)
                const player = await Player.findOne({ _id: args.playerId })

                const highestBid = auction.bids.reduce((x, y) => {
                    return y.bid > x.bid ? y : x
                })

                const userId = highestBid.from._id
                const user = await User.findOne({ _id: userId }).populate(userPopulate)

                user.players.push({
                    player,
                    auction,
                    amount_paid: highestBid.bid
                })

                // ----- Decrease credits amount
                const creditsIndex = user.credits.map(obj => obj.auction._id).indexOf(args.auctionId)
                user.credits[creditsIndex].amount = user.credits[creditsIndex].amount - highestBid.bid

                await user.save()

                // ----- next turn handler

                const maxIndex = auction.users.length - 1
                const currentIndex = auction.users.map(user => user._id).indexOf(auction.turnOf._id)
                
                let nextInline
                
                if (currentIndex === maxIndex || currentIndex > maxIndex) {
                    nextInline = 0
                } else {
                    nextInline = currentIndex + 1
                }

                const nextUserInLine = auction.users[nextInline]

                auction.bids = []
                auction.bidPlayer = null
                auction.turnOf = nextUserInLine
                auction.timer = false

                await auction.save()

                pubsub.publish(`auction_${auction.name}`, { auction })
      
                return auction

            } catch(err) {
                console.log(err)
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
                const auction = await Auction.findOne({ name: args.auction }).populate(auctionPopulate)
                setTimeout(() => pubsub.publish(`auction_${args.auction}`, { auction }), 0)
                return pubsub.asyncIterator(`auction_${args.auction}`)
            }
        }
    }
};

module.exports = auctionResolver