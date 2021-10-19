import { gql } from "apollo-server-core"

export const type = gql`
	scalar Date

	type User {
		id: ID!
		email: String!
		name: String!
		promptpayNumber: String
		promptpayName: String
		rooms(type: GetRoomTypes!, order: String): [Room]!
		createdAt: Date
		updatedAt: Date
	}

	type Room {
		id: ID!
		isOwner: Boolean!
		owner: User!
		title: String!
		members(order: String): [Member]!
		member(id: ID!): Member!
		me: Member!
		items(order: String): [Item]!
		item(id: ID!): Item
		total: Float!
		itemCounts: Int!
		carts: [Cart]!
		createdAt: Date
		updatedAt: Date
	}

	type Member {
		id: ID!
		user: User
		isAnonymous: Boolean!
		nickname: String
		cart: Cart!
		items(order: String): [Item]!
		room: Room!
		role: String!
		payment: Payment
		createdAt: Date
		updatedAt: Date
	}

	type Item {
		id: ID!
		name: String!
		image: String
		price: Int!
		quantity: Int!
		member: Member
		room: Room!
		createdAt: Date
		updatedAt: Date
	}

	type Payment {
		id: ID!
		member: Member!
		image: String
		total: Float!
		createdAt: Date
		updatedAt: Date
	}

	type AuthResponse {
		token: String!
		user: User!
	}

	type Cart {
		total: Float
		items(order: String): [Item]!
		itemCounts: Int!
	}

	type OnItemChangeResponse {
		state: String!
		item: Item
	}

	enum GetRoomTypes {
		MEMBER
		OWNER
		ALL
	}
`
