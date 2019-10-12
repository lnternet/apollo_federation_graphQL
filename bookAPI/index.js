const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const bookData = require("./bookData.json");

// Define types:
const typeDefs = gql`
  extend type Query {
    getBook(id: Int!): Book
  }
  type Book @key(fields: "id") {
    id: ID!
    title: String
    author: String
    currentReader: User
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    books: [Book]
  }
`;

// Define resolvers
const resolvers = {
    Query: {
        getBook(_, args) {
            return bookData.books[args.id];
        }
    },
    Book: {
        currentReader(book) {
            if (!book.belongsTo)
                return null;

            return { 
                __typename: "User", 
                id: book.belongsTo
            };
        }
    },
    User: {
        books(user) {
            return bookData.books.filter(book => book.belongsTo == user.id);
        }
    }
  };

// Create server:
const server = new ApolloServer({
    schema: buildFederatedSchema([
        {
            typeDefs,
            resolvers
        }
    ])
});

// Start listening:
server.listen({ port: 4002 }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});