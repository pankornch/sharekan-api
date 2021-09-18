import { AuthenticationError, UserInputError } from "apollo-server-errors"
import { Resolver } from "../types/gql"
import { User } from "../models/User"
import bcrypt from "bcryptjs"
import { createToken } from "../utils/token"
import { IUser } from "../types/models"
import Joi from "joi"

export const signUp: Resolver = async (_, { input }) => {
	const joi = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
		name: Joi.string().required(),
		confirmPassword: Joi.ref("password"),
	})

	const { error } = joi.validate(input)

	if (error) {
		throw new UserInputError(error.message)
	}

	if (input.password !== input.confirmPassword) {
		throw new UserInputError("password not match")
	}

	delete input.confirmPassword
	input.email = String(input.email).toLowerCase().trim()
	input.password = bcrypt.hashSync(input.password)

	const res = await User.create(input)
	const user = res.toJSON() as IUser
	const token = createToken(user.id)

	return {
		token,
		user,
	}
}

export const signIn: Resolver = async (_, { input }) => {
	const joi = Joi.object({
		email: Joi.string()
			.email()
			.required()
			.error(() => "รูปแบบอีเมลไม่ถูกต้อง"),
		password: Joi.string().required(),
	})

	const { error } = joi.validate(input)

	if (error) {
		throw new UserInputError(error.message)
	}

	const res = await User.findOne({ where: { email: input.email } })

	if (!res) {
		throw new AuthenticationError("Bad Authentication credentials")
	}

	const user = res.toJSON() as IUser

	if (!bcrypt.compareSync(input.password, user.password)) {
		throw new AuthenticationError("Bad Authentication credentials")
	}

	const token = createToken(user.id)

	return {
		token,
		user,
	}
}

export const me: Resolver = async (_, __, context) => {
	return context.user!
}
