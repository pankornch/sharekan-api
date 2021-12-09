import dotenv from "dotenv"
dotenv.config()
import { Sequelize } from "sequelize"

const { POSTGRES_URI, NODE_ENV } = process.env

const sequelize = new Sequelize(POSTGRES_URI!, {
	logging: false,
	dialectOptions:
		NODE_ENV === "production"
			? {
					ssl: {
						require: true, // This will help you. But you will see nwe error
						rejectUnauthorized: false, // This line will fix new error
					},
			  }
			: {},
})

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
