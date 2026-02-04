import { ApolloServer } from "@apollo/server";
import { prismaClient } from "../lib/db.js";
import {User} from "./user/index.js"
async function createApolloServer(){
     const typeDefs = `#graphql
        type Query {
          ${User.queries}
        }
          type Mutation {
          ${User.mutations}
          }
      `;
    
      const resolvers = {
        Query: {
    
          ...User.resolvers.queries
        },
        Mutation: {
          ...User.resolvers.mutations
        }
      };
    
      const gqlServer = new ApolloServer({
        typeDefs,
        resolvers,
      });
      await gqlServer.start();
      return gqlServer;
}
export default createApolloServer;