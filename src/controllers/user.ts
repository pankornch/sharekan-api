import { User } from "../models"
import { Resolver } from "../types/gql"
import bcrypt from "bcryptjs"
import { IUser } from "../types/models"
import { UserInputError } from "apollo-server-errors"

export const updateUser: Resolver = async (_, { input }, { user }) => {
	const res = await User.findByPk(user!.id)
	await res?.update(input)
	return res?.toJSON()
}

export const changePassword: Resolver = async (_, { input }, { user }) => {
	const res = await User.findByPk(user!.id)
	const _user = res?.toJSON() as IUser

	if (!bcrypt.compareSync(input.currentPassword, _user.password)) {
		throw new UserInputError("Incorrect current password")
	}

	await res?.update({ password: bcrypt.hashSync(input.newPassword) })

	return res?.toJSON()
}
