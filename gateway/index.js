const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

// Define list of APIs that will be joined:
const gateway = new ApolloGateway({
    serviceList: [
      { name: "userAPI", url: "http://localhost:4001/graphql" },
      { name: "bookAPI", url: "http://localhost:4002/graphql" }
    ]
  });


(async () => {
    const { schema, executor } = await gateway.load();

    const server = new ApolloServer({ schema, executor });

    server.listen().then(({ url }) => {
        console.log(`Server ready at ${url}`);
    });
}
)();
  