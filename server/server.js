const express = require("express");
const path = require('path');

//Apollo Server 
const { ApolloServer } = require("apollo-server-express");

const {typeDefs, resolvers} = require('apollo-server-express');
const { authMiddleware } = require("./utils/auth");

//db connection
const db = require('./config/connection');
const routes = require('./routes');


const app = express();
const PORT = process.env.PORT || 3001;


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});


server.applyMiddleware({app});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

//get all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
}); 