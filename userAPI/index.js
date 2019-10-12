const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const userData = require("./userData.json");

// Define types:
const typeDefs = gql`
  extend type Query {
    getUser(id: Int!): User
  }
  type User @key(fields: "id") {
    id: ID!
    name: String
    surname: String
  }
`;

// Define resolvers
const resolvers = {
    Query: {
      getUser(_, args) {
        return userData.users.find(user => user.id == args.id);
      }
    },
    User: {
      // This reference resolver is needed for other gateway services to be 
      // able to resolve User object.
      __resolveReference(object) {
        return userData.users.find(user => user.id == object.id);
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
server.listen({ port: 4001 }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});