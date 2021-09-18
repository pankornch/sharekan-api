import { Item } from "./Item"
import { Member } from "./Member"
import { Payment } from "./Payment"
import { Room } from "./Room"
import { User } from "./User"

Member.belongsTo(Room, {
	foreignKey: "roomId",
	targetKey: "id",
})

Room.hasMany(Member, {
	sourceKey: "id",
	foreignKey: "roomId",
})

Room.hasMany(Item, {
	sourceKey: "id",
	foreignKey: "roomId",
})

Member.hasMany(Item, {
	sourceKey: "id",
	foreignKey: "memberId",
})

Item.belongsTo(Member, {
	foreignKey: "memberId",
	targetKey: "id",
})

Item.belongsTo(Room, {
	foreignKey: "roomId",
	targetKey: "id",
})

export { Item, Member, Payment, Room, User }
