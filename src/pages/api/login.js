// src/pages/api/login.js

import { serialize } from "cookie"
import { compare } from "bcryptjs"

export default async function handler(req, res) {
	if (req.method !== "POST") return res.status(405).end()
	const { password } = req.body
	const HASHED_PASSWORD = "$2b$10$9hLas6F44oYVLkyNiyz4k.bXyo2pwU5kLmvytffjYKyrBpq8vwUZe"
	const match = await compare(password, HASHED_PASSWORD)

	if (match) {
		const cookie = serialize("my_secret_auth", "true", {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 30, // 30 days
			path: "/"
		})

		res.setHeader("Set-Cookie", cookie)
		return res.status(200).json({ success: true })
	}

	return res.status(401).json({ error: "Invalid password" })
}
