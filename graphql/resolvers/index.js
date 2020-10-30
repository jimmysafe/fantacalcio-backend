const player = require('./player');
const user = require('./user')
const auction = require('./auction')

const resolvers = [
    player, 
    user,
    auction
];

module.exports = resolvers