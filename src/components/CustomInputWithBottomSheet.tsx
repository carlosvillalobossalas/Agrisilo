import React, { useRef, useEffect } from 'react'
import { TextInput } from 'react-native-paper'
import { Keyboard, DeviceEventEmitter } from 'react-native'
import CustomBottomSheetPicker from './CustomBottomSheetPicker'
import { BottomSheetModal } from '@gorhom/bottom-sheet'

interface CustomInputWithBottomSheet {
    value: string,
    items: { label: string, value: string }[],
    placeholder: string,
    label?: string,
    title: string,
    icon: string,
    onPress: (value: string) => void,
}

const CustomInputWithBottomSheet = ({ value, items, title, icon, label = '', placeholder, onPress }: CustomInputWithBottomSheet) => {

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    useEffect(() => {
        const sub = DeviceEventEmitter.addListener('dismissSheets', () => {
            bottomSheetRef.current?.dismiss()
        })
        return () => {
            sub.remove()
        }
    }, [])

    return (
        <>
            <TextInput
                label={label}
                value={items.find(item => item.value === value)?.label ?? placeholder}
                mode='outlined'
                editable={false}
                right={<TextInput.Icon icon={icon} onPress={() => { Keyboard.dismiss(); bottomSheetRef.current?.present() }} />}
                onPressIn={() => { Keyboard.dismiss(); bottomSheetRef.current?.present() }}
            />
            <CustomBottomSheetPicker
                ref={bottomSheetRef}
                title={title}
                items={items}
                selectedValue={value}
                onPress={(value) => {
                    onPress(value)
                    bottomSheetRef.current?.dismiss()
                }}
            />
        </>
    )
}

export default CustomInputWithBottomSheet