import { createContext, useContext, useEffect, useState } from "react"
import defaultConfig from "data/settings"

const SETTINGS_KEY = "settings"
const IS_DOCKER = process.env.BUILD_MODE === "docker"

export const SettingsContext = createContext({
	settings: undefined,
	setSettings: (settings) => {}
})

export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider = ({ children }) => {
	const [settings, setSettings] = useState()
	const [items, setItems] = useState([])

	// Load settings
	useEffect(() => {
		let data

		if (IS_DOCKER) {
			// FIX 1: Add timestamp to bypass browser cache in Docker mode
			fetch(`/api/loadSettings?t=${new Date().getTime()}`)
				.then((response) => response.json())
				.then((data) => setSettings(data))
				.catch(() => setSettings(defaultConfig))
		} else {
			// FIX 2: Ignore localStorage so the app always uses your settings.json file
			
			// data = localStorage.getItem(SETTINGS_KEY)
			// if (data === "undefined") {
			//     console.log("LocalStorage configuration reset to defaults.")
			// }
			// setSettings(data ? JSON.parse(data) : defaultConfig)

			// Always use the file as the source of truth
			setSettings(defaultConfig)
		}
	}, [])

	// Save settings
	useEffect(() => {
		if (settings && settings !== "undefined") {
			if (IS_DOCKER) {
				fetch("/api/saveSettings", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(settings)
				})
			} else {
				// Optional: You can keep this to save changes made in the UI,
				// but since we disabled loading it above, these saves won't persist
				// across reloads (which is exactly what you want for file-based editing).
				localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
			}

			let filterArr = [
				"help",
				"fetch",
				"config",
				"config help",
				"config edit",
				"config import",
				"config theme",
				"config reset"
			]

			fetch("/api/getTheme")
				.then((response) => response.json())
				.then((data) => {
					if (!data.message) {
						data.forEach((theme) => {
							filterArr.push("config theme " + theme)
						})
					}
				})
				.catch((error) => console.log(`Error fetching themes: ${error.message}`))

			settings.sections.list.map((section) => {
				section.links.map((link) => {
					{
						filterArr.push(link.name.toLowerCase())
					}
				})
			})
			setItems(filterArr)
		}
	}, [settings])

	// Update settings
	const updateSettings = async (newSettings) => {
		await setSettings(newSettings)
	}

	// Reset settings
	const resetSettings = () => {
		setSettings(defaultConfig)
	}

	return (
		<SettingsContext.Provider
			value={{ settings, setSettings: updateSettings, resetSettings, items }}>
			{children}
		</SettingsContext.Provider>
	)
}