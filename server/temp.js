const { graphqlHTTP } = require('express-graphql');

const app = require('express')();
const { buildSchema } = require('graphql');
var books = [
  { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
  { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
  { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
];

var authors = [
  { name: 'Patrick Rothfuss', age: 44, id: '1' },
  { name: 'Brandon Sanderson', age: 42, id: '2' },
  { name: 'Terry Pratchett', age: 66, id: '3' },
];

const schema = buildSchema(`
  type Book {
    id:ID
    name:String
    authorId:ID
    genre:String
    author:Author
  }
  type Author{
    name:String
    id:ID
    age:Int 
  }    
  type Query {
        books:[Book]
        authors:[Author]
        book(id:ID!):Book
        author(id:ID):Author
  }
`);

const rootValue = {
  books: () => books,
  authors: () => authors,
  book: (arg) => {
    return books.find(({ id }) => id == arg.id);
  },
  Book: (one, two, three) => ({
    author: authors[0],
  }),
};

app.use(
  '/graphql',
  graphqlHTTP({
    graphiql: true,
    schema,
    rootValue,
  })
);

app.listen(3000, () => {
  console.log('Yes im listening on http://localhost:3000');
});
