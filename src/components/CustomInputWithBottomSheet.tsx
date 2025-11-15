import React, { useRef } from 'react'
import { TextInput } from 'react-native-paper'
import CustomBottomSheetPicker from './CustomBottomSheetPicker'
import { BottomSheetModal } from '@gorhom/bottom-sheet'

interface CustomInputWithBottomSheet {
    value: string,
    items: { label: string, value: string }[],
    placeholder: string,
    title: string,
    icon: string,
    onPress: (value: string) => void,
}

const CustomInputWithBottomSheet = ({ value, items, title, icon, placeholder, onPress }: CustomInputWithBottomSheet) => {

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    return (
        <>
            <TextInput
                label=''
                value={items.find(item => item.value === value)?.label ?? placeholder}
                mode='outlined'
                editable={false}
                right={<TextInput.Icon icon={icon} onPress={() => { bottomSheetRef.current?.present() }} />}
                onPressIn={() => { bottomSheetRef.current?.present() }}
            />
            <CustomBottomSheetPicker
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

export default CustomInputWithBottomSheet