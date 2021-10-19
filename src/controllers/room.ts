import { UserInputError } from "apollo-server-errors"
import { IMember, IRoom } from "../types/models"
import { Resolver } from "../types/gql"
import { Op } from "sequelize"
import { Item, Member, Room } from "../models"
import toJSON from "../utils/toJSON"
import { ON_MEMBER_JOINED_ROOM } from "../constants"
import faker from "faker"

export const createRoom: Resolver = async (_, { input }, { user }) => {
	const res = await Room.create({ ownerId: user!.id, title: input.title })
	const room = res.toJSON() as IRoom
	Member.create({ roomId: room.id, userId: user!.id, nickname: user!.name })
	return room
}

export const joinRoom: Resolver = async (_, { input }, { user, pubsub }) => {
	if (input.memberId) {
		const memberExist = await Member.findOne({
			where: {
				[Op.and]: [{ id: input.memberId }, { roomId: input.id }],
			},
		})

		if (!memberExist) {
			throw new UserInputError("Incorrect room id")
		}

		const memberJson = memberExist.toJSON() as IMember

		if (!memberJson.isAnonymous || memberJson.userId) {
			throw new UserInputError("Incorrect member id")
		}
		await memberExist.update({
			userId: user!.id,
			nickname: user!.name,
			isAnonymous: false,
		})
		return memberExist.toJSON()
	} else {
		const memberExist = await Member.findOne({
			where: {
				[Op.and]: [{ roomId: input.id }, { userId: user!.id }],
			},
		})

		if (memberExist) {
			throw new UserInputError("You are in this room")
		}
	}

	const memberRes = await Member.create({
		roomId: input.id,
		userId: user!.id,
		nickname: user!.name,
	})

	const member = memberRes.toJSON()

	const membersRes = await Member.findAll({ where: { roomId: input.id } })

	const members = toJSON<IMember[]>(membersRes)

	members.forEach((m) => {
		const roomName = `${m.userId}:${ON_MEMBER_JOINED_ROOM}`
		pubsub.publish(roomName, { onMemberJoinedRoom: member })
	})

	return member
}

export const getRoom: Resolver = async (_, { id }, { user }) => {
	const memberRes = await Member.findOne({
		where: {
			[Op.and]: [{ roomId: id }, { userId: user!.id }],
		},
	})

	if (!memberRes) {
		throw new UserInputError("Incorrect room id")
	}

	const roomRes = await Room.findByPk(id)

	if (!roomRes) {
		throw new UserInputError("Incorrect room id")
	}

	return roomRes.toJSON()
}

export const getUserRooms: Resolver = async (_, { type, order }, { user }) => {
	switch (type) {
		case "OWNER": {
			const res = await Room.findAll({
				where: {
					ownerId: user!.id,
				},
				order: [["createdAt", order || "ASC"]],
			})

			return toJSON(res)
		}

		case "MEMBER": {
			const res = await Room.findAll({
				where: {
					"$rooms.ownerId$": {
						[Op.ne]: user!.id,
					},
				},
				include: {
					model: Member,
					where: {
						userId: user!.id,
					},
				},
				order: [["createdAt", order || "ASC"]],
			})

			return toJSON(res)
		}
		default: {
			const res = await Room.findAll({
				include: {
					model: Member,
					where: {
						userId: user!.id,
					},
				},
				order: [["createdAt", order || "ASC"]],
			})

			return toJSON(res)
		}
	}
}

export const createAnonymousUser: Resolver = async (_, { input }, { user }) => {
	const roomRes = await Room.findOne({
		where: {
			[Op.and]: [{ id: input.roomId }, { ownerId: user!.id }],
		},
	})

	if (!roomRes) {
		throw new UserInputError("You're not owner in this room")
	}

	const memberRes = await Member.create({
		roomId: input.roomId,
		nickname: input.nickname || faker.name.findName(),
		isAnonymous: true,
	})
	return memberRes.toJSON()
}

export const removeRoom: Resolver = async (_, { input }, { user }) => {
	const roomRes = await Room.findOne({
		where: {
			[Op.and]: [{ id: input.id }, { ownerId: user!.id }],
		},
	})

	if (!roomRes) {
		throw new UserInputError("You're not owner in this room")
	}

	await Promise.all([
		Item.destroy({ where: { roomId: input.id } }),
		Member.destroy({ where: { roomId: input.id } }),
		Room.destroy({ where: { id: input.id } }),
	])

	return "success"
}

export const removeMember: Resolver = async (_, { input }, { user }) => {
	const roomRes = await Room.findOne({
		where: {
			ownerId: user!.id,
		},
		include: {
			model: Member,
			where: {
				[Op.and]: [{ roomId: input.roomId }, { id: input.memberId }],
			},
		},
	})

	if (!roomRes) {
		throw new UserInputError(
			"You're not owner in this room or incorrect room id or member id"
		)
	}

	await Item.update({ memberId: null }, { where: { memberId: input.memberId } })
	await Member.destroy({ where: { id: input.memberId } })

	return "success"
}
