import { AuthenticationError } from "apollo-server-errors"
import { Context, Resolver } from "src/types/gql"
import { extractTokenMetadata } from "../utils/token"

export default function authMiddleware(handler: Resolver) {
	return async (parent: any, args: any, context: Context, info: any) => {
		try {
			const user = await extractTokenMetadata(context.authorization)
			context.user = user
			return handler(parent, args, context, info)
		} catch (error) {
			throw new AuthenticationError(error.message)
		}
	}
}
