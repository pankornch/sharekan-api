import { DataTypes } from "sequelize"
import { sequelize } from "./db"

export const Member = sequelize.define(
	"members",
	{
		id: {
			type: DataTypes.STRING,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		roomId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		userId: {
			type: DataTypes.STRING,
		},
		isAnonymous: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		nickname: {
			type: DataTypes.STRING,
			allowNull: false
		},
	},
	{ timestamps: true }
)
