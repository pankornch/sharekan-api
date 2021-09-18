import { ResolverMap } from "src/types/gql"
import Query from "./query"
import Mutation from "./mutation"

import {
	CartResolver,
	UserResolver,
	ItemResolver,
	MemberResolver,
	RoomResolver,
} from "./typesResolvers"
import Subscription from "./subscription"

const resolver: ResolverMap = {
	Query,
	Mutation,
	Subscription,

	User: UserResolver,
	Room: RoomResolver,
	Member: MemberResolver,
	Item: ItemResolver,
	Cart: CartResolver,
}

export default resolver
