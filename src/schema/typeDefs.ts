import { gql } from "apollo-server-express"
import { query } from "./query"
import { mutation } from "./mutaion"
import { subscription } from "./subscription"
import { input } from "./input"
import { type } from "./type"

export default gql`
	${query}

	${mutation}

	${subscription}

	${type}

	${input}
`
