import "dotenv/config";
import express from "express";
import { expressMiddleware } from "@as-integrations/express4";
import createApolloServer from "./graphql/index.js";

const init = async () => {
  const app = express();
  const port = Number(process.env.PORT) || 8000;

  app.use(express.json());
  app.use("/graphql", expressMiddleware(await createApolloServer()));

  app.get("/", (req, res) => {
    res.send("Server running at port " + port);
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`GraphQL at http://localhost:${port}/graphql`);
  });
};

init();
