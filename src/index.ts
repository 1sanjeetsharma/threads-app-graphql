import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";

const init = async () => {
  const app = express();
  const port = Number(process.env.PORT) || 8000;

  const typeDefs = `#graphql
    type Query {
      hello(name: String): String
      hey(name: String): String
    }
  `;

  const resolvers = {
    Query: {
      hello: (_: any, { name }: { name: String }) => `Hello ${name}!`,
      hey: (_: any, { name }: { name: String }) => `Hey ${name}!, how are you doing?`,
    },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers, 
  });

  await server.start();

  app.use(express.json());
  app.use("/graphql", expressMiddleware(server));

  app.get("/", (req, res) => {
    res.send("Server running at port " + port);
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`GraphQL at http://localhost:${port}/graphql`);
  });
};

init();
