import { DataTypes } from "sequelize"
import { sequelize } from "./db"

export const RoomCart = sequelize.define("RoomCart", {
    id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    roomId: {
        type: DataTypes.STRING,
        allowNull: false
    }
    
})