const { ApolloServer, gql } = require('apollo-server-express');
const app = require('express')();

var books = [
  { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
  { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
  { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
  { name: 'The Long Earth 2', genre: 'Sci-Fi', id: '4', authorId: '3' },
];

var authors = [
  { name: 'Patrick Rothfuss', age: 44, id: '1' },
  { name: 'Brandon Sanderson', age: 42, id: '2' },
  { name: 'Terry Pratchett', age: 66, id: '3' },
];

// author:Author
const typeDefs = gql(`
  type Book {
    id:ID
    name:String
    author:Author
    genre:String
  }
  type Author{
    name:String
    id:ID
    age:Int 
    books:[Book]
  }    
  type Query {
    books:[Book]
    authors:[Author]
    book(id:ID!):Book
    author(id:ID):Author
  }
`);

const resolvers = {
  Author: {
    books: (parent, args, ctx, info) =>
      books.filter(({ authorId }) => parent.id === authorId),
  },
  Book: {
    author: (parent, args, ctx, info) =>
      authors.find(({ id }) => id === parent.authorId),
  },
  Query: {
    books: () => books,
    authors: () => authors,
    book: (parent, args, ctx, info) => books.find(({ id }) => id == args.id),
    author: (parent, args, ctx, info) =>
      authors.find(({ id }) => id == args.id),
  },
};

const startServer = async () => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app });

  app.get('/', (req, res) => {
    return res.send('Listinig');
  });

  app.listen(3000, () => {
    console.log('Yes im listening on http://localhost:3000');
  });
};
startServer();
