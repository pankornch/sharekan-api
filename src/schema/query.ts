import { gql } from "apollo-server-express"

export const query = gql`
	type Query {
		me: User!
		room(id: ID!): Room!
		greeting: String!
	}
`
