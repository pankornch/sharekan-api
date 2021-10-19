import { ResolverType } from "../types/gql"
import { Item, Member } from "../models"
import { Op } from "sequelize"
import toJSON from "../utils/toJSON"
import { ICart, IItem, IMember, IRoom, IUser } from "../types/models"
import * as roomController from "../controllers/room"
import {
	itemLoaderBy,
	roomLoaderBy,
	memberLoaderBy,
	userLoaderBy,
} from "../utils/dataLoaders"

export const UserResolver: ResolverType<IUser> = {
	rooms: roomController.getUserRooms,
}

export const RoomResolver: ResolverType<IRoom> = {
	isOwner: async (parent, _, { user }) => {
		if (parent.ownerId === user?.id) return true

		return false
	},
	owner: async (parent) => {
		return userLoaderBy.load({
			key: "id",
			data: parent.ownerId,
		})
	},
	members: async (parent, { order }) => {
		const res = await memberLoaderBy.load({
			key: "roomId",
			data: parent.id,
			hasMany: true,
			order: order,
		})

		memberLoaderBy.clearAll()

		return res
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
	items: async (parent, { order }) => {
		const res = await itemLoaderBy.load({
			key: "roomId",
			data: parent.id,
			hasMany: true,
			order: order,
		})
		itemLoaderBy.clearAll()
		return res
	},
	total: async (parent) => {
		const res: IItem[] = await itemLoaderBy.load({
			key: "roomId",
			data: parent.id,
			hasMany: true,
		})
		itemLoaderBy.clearAll()

		return res.reduce((acc, { price, quantity }) => acc + price * quantity, 0)
	},
	itemCounts: async (parent) => {
		const res: IItem[] = await itemLoaderBy.load({
			key: "roomId",
			data: parent.id,
			hasMany: true,
		})
		itemLoaderBy.clearAll()

		return res.reduce((acc, { quantity }) => acc + quantity, 0)
	},
	item: async (parent, { id }) => {
		const res = await Item.findOne({
			where: {
				[Op.and]: [{ id: id }, { roomId: parent.id }],
			},
		})

		return toJSON(res)
	},
}

export const MemberResolver: ResolverType<IMember> = {
	user: async (parent) => {
		if (!parent.userId) return null
		return userLoaderBy.load({
			key: "id",
			data: parent.userId,
		})
	},
	items: async (parent, { order }) => {
		const res = await itemLoaderBy.load({
			key: "memberId",
			data: parent.id,
			hasMany: true,
			order: order,
		})

		itemLoaderBy.clearAll()
		return res
	},
	cart: async (parent) => {
		const items: IItem[] = await itemLoaderBy.load({
			key: "memberId",
			data: parent.id,
			hasMany: true,
		})
		memberLoaderBy.clearAll()
		return { items }
	},
	role: async (parent) => {
		if (parent.isAnonymous) return "BOT"

		const res: IRoom = await roomLoaderBy.load({
			key: "id",
			data: parent.roomId,
		})

		if (res.ownerId === parent.userId) return "OWNER"

		return "MEMBER"
	},
}

export const ItemResolver: ResolverType<IItem> = {
	member: async (parent) => {
		const res = await memberLoaderBy.load({
			key: "id",
			data: parent.memberId,
		})
		memberLoaderBy.clearAll()

		return res
	},
}

export const CartResolver: ResolverType<ICart> = {
	total: (parent) => {
		return parent.items.reduce(
			(acc, { price, quantity }) => acc + price * quantity,
			0
		)
	},
	itemCounts: (parent) => {
		return parent.items.reduce((acc, { quantity }) => acc + quantity, 0)
	},
}
