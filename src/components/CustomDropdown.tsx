import React from 'react'
import { ViewStyle } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'

interface CustomDropdown {
    open: boolean
    value: string
    items: { label: string, value: string }[]
    placeholder: string
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    setValue: React.Dispatch<React.SetStateAction<string>>
}

const dropdownStyle: ViewStyle = {
    borderColor: 'transparent',
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    // minHeight: 40,
    zIndex: 1,
}

const dropdownContainerStyle: ViewStyle = {
    borderColor: '#ddd',
    maxHeight: 120,
}


const CustomDropdown = ({ open, value, items, placeholder, setOpen, setValue, }: CustomDropdown) => {
    return (
        <DropDownPicker
            // listMode='MODAL'
            // modalTitle={placeholder}
            open={open}
            setOpen={setOpen}
            value={value}
            setValue={setValue}
            dropDownDirection='BOTTOM'
            items={items}
            
            placeholder={placeholder}
            style={dropdownStyle}
            dropDownContainerStyle={dropdownContainerStyle}
            labelProps={{
                numberOfLines: 1
            }}
            tickIconStyle={{
                aspectRatio: 0.7
            }}
            arrowIconStyle={{
                aspectRatio: 0.7
            }}
        />
    )
}

export default CustomDropdown