import { PubSub } from "graphql-subscriptions"
import { IUser } from "./models"

export interface Context {
	req: Express.Request
	pubsub: PubSub
	authorization: string
	user?: IUser
}

export type Resolver = (
	parent: any,
	args: any,
	context: Context,
	info: any
) => any

export interface ResolverType {
	[key: string]: Resolver
}

export interface ResolverMap {
	[key: string]: ResolverType | ResolverMap
}
