import React from 'react'
import ColorPicker, { Panel5, Preview } from 'reanimated-color-picker'

interface CustomColorPicker {
    selectedColor: string
    setSelectedColor: React.Dispatch<React.SetStateAction<string>>
}

const CustomColorPicker = ({ selectedColor, setSelectedColor }: CustomColorPicker) => {
    return (
        <ColorPicker
            style={{ width: '100%', height: 100, gap: 5, alignItems: 'center' }}
            value={selectedColor}
            onChangeJS={(color) => {
                setSelectedColor(color.hex)
            }}
        >
            <Panel5 style={{ width: 200 }} />

            <Preview style={{ width: 250 }} hideInitialColor hideText />

        </ColorPicker>
    )
}

export default CustomColorPicker