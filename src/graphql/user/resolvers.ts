import { prismaClient } from "../../lib/db.js";
import UserService, { CreateUserPayload } from "../../services/user.js";

const queries = {
    getUserToken: async (_: any, payload: { email: string, password: string }) => {
        const token = UserService.getUserToken({
            email: payload.email,
            password: payload.password
        })
        return token;
    },
    getCurrentLoggedInUser: async (_: any, paramerers: any, context: any) => {
        if (context.id) {
            const id = context.id;
            const user = await UserService.getUserById(id);
            console.log("user found id db:", user);
            return user
        }
        throw new Error("i don't know, who are you");
    }
};
const mutations = {
    createUser: async (_: any, payload: CreateUserPayload) => {
        const res = await UserService.createUser(payload);
        return res.id;
    }
};

export const resolvers = { queries, mutations };