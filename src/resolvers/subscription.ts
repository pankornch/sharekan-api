import { UserInputError } from "apollo-server-errors"
import { Op } from "sequelize"
import {
	ON_ADD_ITEM,
	ON_MEMBER_JOINED_ROOM,
	ON_REMOVE_ITEM,
	ON_UPDATE_ITEM,
	ON_ITEM_CHANGE,
} from "../constants"
import auth from "../middleware/auth"
import { Member } from "../models"
import { ResolverMap } from "../types/gql"

const Subscription: ResolverMap = {
	hello: {
		subscribe: (_, __, { pubsub }) => {
			return pubsub.asyncIterator(["hello", "world"])
		},
	},
	onMemberJoinedRoom: {
		subscribe: auth((_, __, { pubsub, user }) => {
			return pubsub.asyncIterator(`${user!.id}:${ON_MEMBER_JOINED_ROOM}`)
		}),
	},
	onAddItem: {
		subscribe: auth(async (_, { input }, { user, pubsub }) => {
			const memberRes = await Member.findOne({
				where: { [Op.and]: [{ roomId: input.roomId }, { userId: user!.id }] },
			})

			if (!memberRes) {
				throw new UserInputError("Incorrect room id")
			}

			return pubsub.asyncIterator(`${input.roomId}:${ON_ADD_ITEM}`)
		}),
	},
	onUpdateItem: {
		subscribe: auth(async (_, { input }, { user, pubsub }) => {
			const memberRes = await Member.findOne({
				where: { [Op.and]: [{ roomId: input.roomId }, { userId: user!.id }] },
			})

			if (!memberRes) {
				throw new UserInputError("Incorrect room id")
			}

			return pubsub.asyncIterator(`${input.roomId}:${ON_UPDATE_ITEM}`)
		}),
	},
	onRemoveItem: {
		subscribe: auth(async (_, { input }, { user, pubsub }) => {
			const memberRes = await Member.findOne({
				where: { [Op.and]: [{ roomId: input.roomId }, { userId: user!.id }] },
			})

			if (!memberRes) {
				throw new UserInputError("Incorrect room id")
			}

			return pubsub.asyncIterator(`${input.roomId}:${ON_REMOVE_ITEM}`)
		}),
	},
	onItemChange: {
		subscribe: auth(async (_, { input }, { user, pubsub }) => {
			const memberRes = await Member.findOne({
				where: { [Op.and]: [{ roomId: input.roomId }, { userId: user!.id }] },
			})

			if (!memberRes) {
				throw new UserInputError("Incorrect room id")
			}

			return pubsub.asyncIterator(`${input.roomId}:${ON_ITEM_CHANGE}`)
		}),
	},
}

export default Subscription
