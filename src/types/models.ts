export interface IUser {
	id: string
	name: string
	email: string
	password: string
	promptpayNumber?: string
	promptpayName?: string
	createdAt: Date
	updatedAt: Date
}

export interface IRoom {
	id: string
	ownerId: string
	title: string
	createdAt: Date
	updatedAt: Date
}

export interface IMember {
	id: string
	userId: string
	roomId: string
	isAnonymous: boolean
	nickname: string
	createdAt: Date
	updatedAt: Date
}

export interface IItem {
	id: string
	memberId: string
	roomId: string
	image: string
	price: number
	quantity: number
	createdAt: Date
	updatedAt: Date
}

export interface IPayment {
	id: string
	member: string
	image: string
	total: number
	createdAt: Date
	updatedAt: Date
}

export interface ICart {
	total: number
	items: IItem[]
}

export type Modify<T, R> = Omit<T, keyof R> & R