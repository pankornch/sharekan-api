import { DataTypes } from "sequelize"
import { sequelize } from "./db"

export const Room = sequelize.define(
	"rooms",
	{
		id: {
			type: DataTypes.STRING,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ownerId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ timestamps: true }
)
