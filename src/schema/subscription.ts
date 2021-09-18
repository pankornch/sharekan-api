import { gql } from "apollo-server-core"

export const subscription = gql`
	type Subscription {
		hello: String!
		onMemberJoinedRoom: Member!
		onAddItem(input: OnSubscribeItemInput!): Item!
		onUpdateItem(input: OnSubscribeItemInput!): Item!
		onRemoveItem(input: OnSubscribeItemInput!): Item!
        onItemChange(input: OnSubscribeItemInput!): OnItemChangeResponse!
	}
`
