const { gql } = require('apollo-server');
const player = require('./playerDefs')
const user = require('./userDefs')
const auction = require('./auctionDefs')

const typeDefs = gql`
    type Query{
        _empty: String
    }
    type Mutation {
        _empty: String
    }
    type Subscription {
        _empty: String
    }

    ${ player }
    ${ user }
    ${ auction }
`

module.exports = typeDefs