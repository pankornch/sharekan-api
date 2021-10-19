import { PubSub } from "graphql-subscriptions"
import { IUser } from "./models"

export interface Context {
	req: Express.Request
	pubsub: PubSub
	authorization: string
	user?: IUser
}

export type Resolver<T = any> = (
	parent: T,
	args: any,
	context: Context,
	info: any
) => any

export interface ResolverType<T = any> {
	[key: string]: Resolver<T>
}

export interface ResolverMap {
	[key: string]: ResolverType | ResolverMap
}
