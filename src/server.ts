import express from "express"
import { ApolloServer } from "apollo-server-express"
import { createServer } from "http"

import { execute, subscribe } from "graphql"
import { SubscriptionServer } from "subscriptions-transport-ws"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { PubSub } from "graphql-subscriptions"

import typeDefs from "./schema/typeDefs"
import resolvers from "./resolvers/resolvers"
import * as db from "./models/db"

import changelog from "./changelog"

const app = express()
const PORT = process.env.PORT || 4000
const pubsub = new PubSub()
const httpServer = createServer(app)

const schema = makeExecutableSchema({ typeDefs, resolvers })

;(async () => {
	app.use("/changelog", changelog)
	try {
		const server = new ApolloServer({
			schema,
			context: ({ req }) => {
				const authorization = req.headers.authorization || ""
				return { req, pubsub, authorization }
			},
		})
		await server.start()

		server.applyMiddleware({ app })

		SubscriptionServer.create(
			{
				schema,
				execute,
				subscribe,
				onConnect: (params: any, _: any) => {
					const authorization = params.Authorization || ""
					return { params, pubsub, authorization }
				},
			},
			{ server: httpServer, path: server.graphqlPath }
		)

		await db.ping()
		await db.sequelize.sync()

		httpServer.listen(PORT, () => {
			console.log(
				`🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
			)
			console.log(
				`🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
			)
		})
	} catch (e) {
		console.log(e)
	}
})()
