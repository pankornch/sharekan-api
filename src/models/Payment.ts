import { DataTypes } from "sequelize"
import { sequelize } from "./db"

export const Payment = sequelize.define(
	"payment",
	{
		id: {
			type: DataTypes.STRING,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		member: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		image: {
			type: DataTypes.STRING,
		},
		total: {
			type: DataTypes.FLOAT,
			defaultValue: 0.0,
			allowNull: false,
		},
	},
	{ timestamps: true }
)
