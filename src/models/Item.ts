import { DataTypes } from "sequelize"
import { sequelize } from "./db"

export const Item = sequelize.define(
	"items",
	{
		id: {
			type: DataTypes.STRING,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		memberId: {
			type: DataTypes.STRING,
		},
		roomId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		image: {
			type: DataTypes.STRING,
		},
		price: {
			type: DataTypes.FLOAT,
			defaultValue: 0.0,
			allowNull: false,
		},
		quantity: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	},
	{ timestamps: true }
)
