import { ResolverType } from "../types/gql"
import auth from "../middleware/auth"

import * as authController from "../controllers/auth"
import * as roomController from "../controllers/room"
import * as itemController from "../controllers/item"
import * as userController from "../controllers/user"

const Mutation: ResolverType = {
	signUp: authController.signUp,
	signIn: authController.signIn,

	updateProfile: auth(userController.updateUser),
	changePassword: auth(userController.changePassword),

	createRoom: auth(roomController.createRoom),
	joinRoom: auth(roomController.joinRoom),
	createAnonymousUser: auth(roomController.createAnonymousUser),
	removeRoom: auth(roomController.removeRoom),
	removeMember: auth(roomController.removeMember),

	addItem: auth(itemController.addItem),
	updateItem: auth(itemController.updateItem),
	removeItem: auth(itemController.removeItem),
}

export default Mutation
