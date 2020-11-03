const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config()

const { DB_USERNAME, DB_PASSWORD, DB_URL, DB_NAME } = process.env


const typeDefs = require('./graphql/typeDefs')
const resolvers = require("./graphql/resolvers");

const pubsub = new PubSub() 
pubsub.ee.setMaxListeners(30)

const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: () => ({
        pubsub
    })
});


mongoose
.connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('DB Connected!')
    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
})
.catch(err => console.log(err))