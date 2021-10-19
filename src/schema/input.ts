import { gql } from "apollo-server-core"

export const input = gql`
	input SignUpInput {
		email: String!
		password: String!
		confirmPassword: String!
		name: String!
	}

	input SignInInput {
		email: String!
		password: String!
	}

	input AddItemToRoomWithOwnerInput {
		name: String!
		price: Float!
		quantity: Int!
		image: String
		memberId: ID
		roomId: String!
	}

	input AddItemToRoomWithMemberInput {
		name: String!
		price: Float!
		quantity: Int!
		image: String
		roomId: ID!
	}

	input RemoveItemInput {
		id: ID!
		roomId: String!
	}

	input AddItemInput {
		name: String!
		price: Float!
		quantity: Int!
		roomId: ID!
		memberId: String
	}

	input CreateAnonymousUserInput {
		roomId: ID!
		nickname: String
	}

	input MoveItemInput {
		roomId: ID!
		itemId: ID!
		toMemberId: String!
	}

	input CreateRoomInput {
		title: String!
	}

	input UpdateItemInput {
		name: String
		price: Float
		quantity: Int
		roomId: ID!
		memberId: ID!
		id: String!
	}

	input OnSubscribeItemInput {
		roomId: ID!
	}

	input UpdateProfileInput {
		name: String
		email: String
		promptpayName: String
		promptpayNumber: String
	}

	input ChangePasswordInput {
		currentPassword: String!
		newPassword: String!
	}

	input JoinRoomInput {
		id: ID!
		memberId: ID
	}

	input RemoveRoomInput {
		id: ID!
	}

	input RemoveMemberInput {
		roomId: ID!
		memberId: ID!
	}
`
