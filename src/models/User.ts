import { DataTypes } from "sequelize"
import { sequelize } from "./db"

export const User = sequelize.define(
	"users",
	{
		id: {
			type: DataTypes.STRING,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		promptpayName: {
			type: DataTypes.STRING,
		},
		promptpayNumber: {
			type: DataTypes.STRING,
		},
	},
	{
		timestamps: true,
	}
)
