import { ResolverType } from "../types/gql"
import * as roomController from "../controllers/room"
import { Item, Member, Room, User } from "../models"
import { Op } from "sequelize"
import toJSON from "../utils/toJSON"
import { IItem, IMember } from "../types/models"

export const UserResolver: ResolverType = {
	rooms: roomController.getUserRooms,
}

export const RoomResolver: ResolverType = {
	owner: async (parent) => {
		const res = await User.findByPk(parent.ownerId)
		return JSON.parse(JSON.stringify(res))
	},
	members: async (parent) => {
		const res = await Member.findAll({ where: { roomId: parent.id } })
		return JSON.parse(JSON.stringify(res))
	},
	member: async (parent, { id }) => {
		const memberRes = await Member.findOne({
			where: {
				[Op.and]: [{ roomId: parent.id }, { id: id }],
			},
		})

		return toJSON(memberRes)
	},
	me: async (parent, _, { user }) => {
		const res = await Member.findOne({
			where: {
				[Op.and]: [{ userId: user!.id }, { roomId: parent.id }],
			},
		})

		return res?.toJSON()
	},
	items: async (parent, _) => {
		const res = await Item.findAll({ where: { roomId: parent.id } })

		return JSON.parse(JSON.stringify(res))
	},
	total: async (parent) => {
		const res = await Item.findAll({ where: { roomId: parent.id } })
		const items = toJSON<IItem[]>(res)

		return items.reduce((acc, { price, quantity }) => acc + price * quantity, 0)
	},
	itemCounts: async (parent) => {
		const res = await Item.findAll({ where: { roomId: parent.id } })
		const items = toJSON<IItem[]>(res)

		return items.reduce((acc, { quantity }) => acc + quantity, 0)
	},
	item: async (parent, { id }) => {
		const res = await Item.findOne({
			where: {
				[Op.and]: [{ id: id }, { roomId: parent.id }],
			},
		})

		return JSON.parse(JSON.stringify(res))
	},
}

export const MemberResolver: ResolverType = {
	user: async (parent) => {
		const res = await User.findByPk(parent.userId)
		return res?.toJSON()
	},
	items: async (parent) => {
		const res = await Item.findAll({ where: { memberId: parent.id } })
		return JSON.parse(JSON.stringify(res))
	},
	cart: async (parent) => {
		const itemRes = await Item.findAll({
			where: {
				memberId: parent.id,
			},
		})

		const items = toJSON<IItem[]>(itemRes)

		return {
			items,
		}
	},
	role: async (parent: IMember) => {
		if (parent.isAnonymous) return "BOT"

		const res = await Room.findOne({
			where: {
				[Op.and]: [{ id: parent.roomId }, { ownerId: parent.userId }],
			},
		})

		if (res) return "OWNER"

		return "MEMBER"
	},
}

export const ItemResolver: ResolverType = {
	member: async (parent) => {
		const res = await Member.findByPk(parent.memberId)
		return res?.toJSON()
	},
}

export const CartResolver: ResolverType = {
	total: (parent) => {
		return (parent.items as IItem[]).reduce(
			(acc, { price, quantity }) => acc + price * quantity,
			0
		)
	},
	itemCounts: (parent) => {
		return (parent.items as IItem[]).reduce(
			(acc, { quantity }) => acc + quantity,
			0
		)
	},
}
