import { ResolverType } from "../types/gql"
import auth from "../middleware/auth"
import * as authController from "../controllers/auth"
import * as roomController from "../controllers/room"

const Query: ResolverType = {
	me: auth(authController.me),
	room: auth(roomController.getRoom),
	greeting: (_, __, { pubsub }) => {
		pubsub.publish("world", { hello: "hello there" })
		return "Hi there"
	},
}

export default Query
