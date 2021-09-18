export default <T>(data: Object | null): T =>
	data === null ? null : JSON.parse(JSON.stringify(data))
