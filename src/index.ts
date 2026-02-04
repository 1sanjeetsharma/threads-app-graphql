import "dotenv/config";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { prismaClient } from "./lib/db.js";
const init = async () => {
  const app = express();
  const port = Number(process.env.PORT) || 8000;

  const typeDefs = `#graphql
    type Query {
      
      hey(name: String): String
    }
      type Mutation {
      createUser(email:String!, name:String!, password: String!): Boolean
      }
  `;

  const resolvers = {
    Query: {

      hey: (_: any, { name }: { name: String }) => `Hey ${name}!, how are you doing?`,
    },
    Mutation: {
      createUser: async (_: any, { name, email, password }: { name: string, email: string, password: string }) => {
        await prismaClient.user.create({
          data: { email, name, password, salt: "random_salt" },
        })
        return true;
      }
    }
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
