import express from "express"
import fs from "fs"
import { marked } from "marked"

const router = express.Router()

router.get("/", (_, res) => {
	fs.readFile(__dirname + "/CHANGELOG.md", "utf-8", (e, data) => {
		if (e) return console.log(e)
        res.send(marked.parse(data))
	})
})

export default router
