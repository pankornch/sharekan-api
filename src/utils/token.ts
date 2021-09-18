import dotenv from "dotenv"
dotenv.config()

import jwt from "jsonwebtoken"
import { IUser } from "../types/models"
import { User } from "../models/User"

const { JWT_SECRET } = process.env

const BadAuthenticationTokenErrorMessage = "Bad Authentication Token"

export const createToken = (id: string) => {
	return jwt.sign({ sub: "auth", id }, JWT_SECRET!)
}

export const verifyToken = (bearerToken: string) => {
	const splitToken = bearerToken.split(" ")

	if (splitToken.length !== 2 || splitToken[0] !== "Bearer") {
		throw new Error(BadAuthenticationTokenErrorMessage)
	}

	return splitToken[1]
}

export const extractTokenMetadata = async (
	bearerToken: string
): Promise<IUser> => {
	const token = verifyToken(bearerToken)

	const decoded: any = jwt.verify(token, JWT_SECRET!)

	const res = await User.findByPk(decoded.id)

	if (!res) {
		throw new Error(BadAuthenticationTokenErrorMessage)
	}

	return res.toJSON() as IUser
}
