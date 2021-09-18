import { gql } from "apollo-server-express"

export const mutation = gql`
	type Mutation {
		signUp(input: SignUpInput!): AuthResponse!
		signIn(input: SignInInput!): AuthResponse!

		updateProfile(input: UpdateProfileInput!): User!
		changePassword(input: ChangePasswordInput!): User!

		createRoom(input: CreateRoomInput!): Room!
		joinRoom(input: JoinRoomInput!): Room!
		createAnonymousUser(input: CreateAnonymousUserInput!): Member!
		removeRoom(input: RemoveRoomInput!): String!

		addItem(input: AddItemInput!): Item!
		updateItem(input: UpdateItemInput!): Item!
		removeItem(input: RemoveItemInput!): String!
		moveItem(input: MoveItemInput!): Item!
	}
`
