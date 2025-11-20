import React, { useState } from "react"
import Link from "@/components/Link"
import Search from "@/components/Search"
import { useSettings } from "@/context/settings"

const Section = ({ section, filter, selection }) => {
    const alignment = section.align || "left"
    return (
        <div className={`mb-4 align-${alignment}`}>
            <h2 className={`text-title font-bold mt-0 mb-2 cursor-default text-${section.color}`}>
                {section.title}
            </h2>

            {/* Added flex-wrap to create the grid layout */}
            <ul className="flex flex-wrap justify-start gap-1">
                {section.links.map((link, index) => {
                    return (
                        <Link
                            key={index}
                            linkData={link}
                            filter={filter}
                            selection={selection}
                            sectionColor={section.color}
                        />
                    )
                })}
            </ul>
        </div>
    )
}

const List = () => {
    const { settings } = useSettings()
    const [command, setCommand] = useState("")
    const [selection, setSelection] = useState("")

    const handleCommandChange = (str) => {
        setCommand(str)
    }

    const handleSelectionChange = (sel) => {
        setSelection(sel)
    }

    return (
        <div id="list">
            {/* Keeps the 3-column layout for categories, but icons inside will now be grids */}
            <div className="grid grid-cols-3 gap-4 px-3 py-2 mb-5">
                {settings.sections.list.map((section, index) => {
                    return (
                        <Section
                            key={index}
                            section={section}
                            filter={command}
                            selection={selection}
                        />
                    )
                })}
            </div>
            <Search commandChange={handleCommandChange} selectionChange={handleSelectionChange} />
        </div>
    )
}

export default List