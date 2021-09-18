import { Resolver } from "../types/gql"
import { UserInputError } from "apollo-server-express"
import { Room, Member, Item } from "../models"
import selectKey from "../utils/selectKeys"
import { ON_ADD_ITEM, ON_ITEM_CHANGE } from "../constants"
import { IItem } from "../types/models"

export const removeItem: Resolver = async (_, { input }, { pubsub }) => {
	const itemRes = await Item.findOne({
		where: { id: input.id },
		include: {
			model: Room,
			where: { id: input.roomId },
		},
	})

	if (!itemRes) {
		throw new UserInputError("Incorrect item id")
	}

	await Item.destroy({
		where: {
			id: input.id,
		},
	})

	pubsub.publish(`${input!.roomId}:${ON_ITEM_CHANGE}`, {
		onItemChange: {
			state: "REMOVE",
			item: { id: input.id },
		},
	})

	return `deleted ${input.id} success`
}

export const addItem: Resolver = async (_, { input }, { pubsub }) => {
	const itemRes = await Item.create(input)

	const item = itemRes.toJSON() as IItem

	pubsub.publish(`${item!.roomId}:${ON_ADD_ITEM}`, { onAddItem: item })
	pubsub.publish(`${item!.roomId}:${ON_ITEM_CHANGE}`, {
		onItemChange: {
			state: "ADD",
			item,
		},
	})

	return item
}

export const updateItem: Resolver = async (_, { input }, { user, pubsub }) => {
	const res = await Room.findOne({
		where: { id: input.roomId },
		include: [
			{
				model: Member,
				where: {
					userId: user!.id,
				},
			},
			{
				model: Item,
				where: {
					id: input.id,
				},
			},
		],
	})

	if (!res) {
		throw new UserInputError("Incorrect item id")
	}
	const itemRes = await Item.findByPk(input.id)

	const cleanInput = selectKey(input, ["name", "price", "quantity", "memberId"])

	await itemRes?.update(cleanInput)

	const item = itemRes?.toJSON() as IItem

	pubsub.publish(`${item!.roomId}:${ON_ITEM_CHANGE}`, {
		onItemChange: {
			state: "UPDATE",
			item,
		},
	})

	return itemRes
}
