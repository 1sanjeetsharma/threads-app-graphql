import { prismaClient } from "../lib/db.js"
import { createHmac, randomBytes } from "node:crypto";
import JWT from 'jsonwebtoken';
// const JWT = require('jsonwebtoken');
const JWT_SECRET = " $uperM@an@123";
export interface CreateUserPayload {
    name: string
    email: string
    password: string
}
export interface GerUserTokenPayload {
    email: string;
    password: string;
}
export default class UserService {
    private static generateHash(salt: string, password: string) {
        const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");
        return hashedPassword;
    }
    public static createUser(payload: CreateUserPayload) {
        const { name, email, password } = payload;
        const salt = randomBytes(32).toString();
        const hashedPassword = UserService.generateHash(salt, password)
        return prismaClient.user.create(
            {
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    salt,
                }
            }
        );
    }
    private static getUserByEmail(email: string) {
        return prismaClient.user.findUnique({ where: { email } })
    }
    public static async getUserToken(payload: GerUserTokenPayload) {
        const { email, password } = payload;
        const user = await UserService.getUserByEmail(email);
        if (!user) throw new Error("user not found");

        const userSalt = user.salt;
        const userHashedPassword = UserService.generateHash(userSalt, password)
        if (userHashedPassword !== user.password)
            throw new Error("Incorrect Password");
        //generate token
        const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET)
        return token;

    }
    public static decodeJWTToken(token:string){
        return JWT.verify(token, JWT_SECRET);
    }
    public static  getUserById(id:string){
        return prismaClient.user.findUnique({where: {id}});
      
    }
}