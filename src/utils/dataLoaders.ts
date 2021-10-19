import DataLoader from "dataloader"
import { Model, ModelCtor, Op } from "sequelize"
import { Item, Member, Room, User } from "../models"
import toJSON from "./toJSON"

interface Props {
	key: string
	data: string
	order?: "ASC" | "DESC" | "asc" | "desc"
	hasMany?: boolean
}

interface BatchProps {
	args: readonly Props[]
	model: ModelCtor<Model<any, any>>
}

const batch = async ({ args, model }: BatchProps) => {
	const key: string = args[0].key
	const hasMany = args[0].hasMany
	const order = args[0].order || "ASC"
	const data = args.map((a) => a.data)

	const res = await model.findAll({
		where: {
			[key]: { [Op.in]: data },
		},
		order: [["createdAt", order]],
	})

	const arr = toJSON<any[]>(res)

	if (hasMany) {
		return data.map((d) => arr.filter((e) => e[key] === d))
	}

	const result: any = {}

	arr.forEach((r) => {
		result[r[key]] = r
	})

	return data.map((d) => result[d])
}

export const roomLoaderBy = new DataLoader<Props, any>(async (args) => {
	return await batch({ args, model: Room })
})

export const itemLoaderBy = new DataLoader<Props, any>(async (args) => {
	return batch({ args, model: Item })
})

export const memberLoaderBy = new DataLoader<Props, any>(async (args) => {
	return batch({ args, model: Member })
})

export const userLoaderBy = new DataLoader<Props, any>(async (args) => {
	return batch({ args, model: User })
})
