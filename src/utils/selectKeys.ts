import toJSON from "./toJSON"

export default (obj: any, fields?: string[]) => {
	const clone = toJSON(obj) as any

	Object.keys(clone).forEach((k) => {
		if (obj[k] === undefined) {
			delete clone[k]
		}

		if (fields !== undefined && !fields!.includes(k)) {
			delete clone[k]
		}
	})

	return clone
}
