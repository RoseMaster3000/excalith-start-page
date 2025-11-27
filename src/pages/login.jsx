// src/pages/login.jsx
import { useState } from "react"
import { useRouter } from "next/router"

export default function Login() {
	const [password, setPassword] = useState("")
	const router = useRouter()

	const handleSubmit = async (e) => {
		e.preventDefault()

		const res = await fetch("/api/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ password })
		})

		if (res.ok) {
			router.push("/") // Redirect to home on success
		} else {
			alert("Wrong password")
		}
	}

	return (
		<div
			style={{
				display: "flex",
				height: "100vh",
				justifyContent: "center",
				alignItems: "center",
				background: "#1a1b26",
				color: "#fff"
			}}>
			<form onSubmit={handleSubmit}>
				<h1>Login</h1>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					style={{ padding: "10px", borderRadius: "5px", border: "none" }}
				/>
				<button type="submit" style={{ marginLeft: "10px", padding: "10px" }}>
					Go
				</button>
			</form>
		</div>
	)
}
