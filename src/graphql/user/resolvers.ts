import { prismaClient } from "../../lib/db.js";

const queries = {
    hey: (_: any, { name }: { name: String }) => `Hey ${name}!, how are you doing?`,
};
const mutations = {
    createUser: async (_: any, { name, email, password }: { name: string, email: string, password: string }) => {
                await prismaClient.user.create({
                  data: { email, name, password, salt: "random_salt" },
                })
                return true;
              }
};

export const resolvers = {queries, mutations};