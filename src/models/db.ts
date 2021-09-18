import dotenv from "dotenv"
dotenv.config()
import { Sequelize } from "sequelize"

const { POSTGRES_URI } = process.env

const sequelize = new Sequelize(POSTGRES_URI!, { logging: false })

const ping = () => {
	return new Promise(async (resolve, reject) => {
		try {
			await sequelize.authenticate()
			resolve("Connection has been established successfully.")
		} catch (e) {
			reject(`Unable to connect to the database: ${e}`)
		}
	})
}

export { sequelize, ping }
