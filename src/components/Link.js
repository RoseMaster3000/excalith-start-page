import React, { useEffect, useState } from "react"
import { useSettings } from "@/context/settings"
import { Icon } from "@iconify/react"

// 1. Accept the 'sectionColor' prop
const Link = ({ linkData, filter, selection, sectionColor }) => {
    const { settings } = useSettings()
    const [isHidden, setHidden] = useState(false)
    const [isSelected, setSelected] = useState(false)

    const name = linkData.name
    const lower_name = linkData.name.toLowerCase()
    const url = linkData.url
    const icon = linkData.icon
    const target = settings.urlLaunch.target

    useEffect(() => {
        const lower_command = filter.toLowerCase()
        if (lower_command) {
            const isFiltered = lower_name.includes(lower_command)
            setHidden(!isFiltered)
        } else {
            setHidden(false)
        }
    }, [filter, lower_name, target, url])

    useEffect(() => {
        setSelected(lower_name === selection)
    }, [selection, lower_name])

    return (
        <li className="inline-block">
            <a
                className={`
                    inline-flex items-center justify-center
                    p-2 m-1 rounded-lg transition-all duration-200
                    ${isHidden ? "opacity-10 grayscale" : "opacity-100"}
                    ${isSelected ? "selected scale-110" : "hover:bg-white/10 hover:scale-110"}
                `}
                href={url}
                rel="noopener noreferrer nofollow"
                target={target}
                title={name}
            >
                <span 
                    className="block w-8 h-8 text-center transition-all duration-200"
                    style={{ 
                        color: isSelected ? 'inherit' : `var(--${sectionColor})`,
                        filter: isSelected ? 'none' : 'saturate(0.4)'
                    }}
                >
                    <Icon icon={icon} className="w-full h-full" />
                </span>
            </a>
        </li>
    )
}

export default Link