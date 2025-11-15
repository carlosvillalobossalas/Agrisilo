import React, { useRef } from 'react'
import { TextInput } from 'react-native-paper'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import CustomBottomSheetMultiplePicker from './CustomBottomSheetMultiplePicker'

interface CustomMultipleInputWithBottomSheet {
    value: string[],
    items: { label: string, value: string }[],
    placeholder: string,
    title: string,
    icon: string,
    onPress: (value: string) => void,
}

const CustomMultipleInputWithBottomSheet = ({ value, items, title, icon, placeholder, onPress }: CustomMultipleInputWithBottomSheet) => {

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const currentValue = value.length === 0 ? placeholder : items.filter(item => value.includes(item.value)).map(item => item.label).join(', ')

    return (
        <>
            <TextInput
                label=''
                value={currentValue}
                mode='outlined'
                editable={false}
                right={<TextInput.Icon icon={icon} onPress={() => { bottomSheetRef.current?.present() }} />}
                onPressIn={() => { bottomSheetRef.current?.present() }}
            />
            <CustomBottomSheetMultiplePicker
                ref={bottomSheetRef}
                title={title}
                items={items}
                selectedValue={value}
                onPress={(value) => {
                    onPress(value)
                }}
            />
        </>
    )
}

export default CustomMultipleInputWithBottomSheet