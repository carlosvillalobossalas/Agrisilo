import React, { useRef, useEffect } from 'react'
import { TextInput } from 'react-native-paper'
import { Keyboard, DeviceEventEmitter } from 'react-native'
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
    const lastDismissedRef = useRef<number>(0);

    useEffect(() => {
        const sub = DeviceEventEmitter.addListener('dismissSheets', () => {
            bottomSheetRef.current?.dismiss()
            lastDismissedRef.current = Date.now()
        })
        return () => sub.remove()
    }, [])

    const currentValue = value.length === 0 ? placeholder : items.filter(item => value.includes(item.value)).map(item => item.label).join(', ')

    return (
        <>
            <TextInput
                label=''
                value={currentValue}
                mode='outlined'
                editable={false}
                right={<TextInput.Icon icon={icon} onPress={() => {
                    const now = Date.now();
                    if (now - lastDismissedRef.current < 300) return;
                    Keyboard.dismiss();
                    bottomSheetRef.current?.present()
                }} />}
                onPressIn={() => {
                    const now = Date.now();
                    if (now - lastDismissedRef.current < 300) return;
                    Keyboard.dismiss();
                    bottomSheetRef.current?.present()
                }}
            />
            <CustomBottomSheetMultiplePicker
                ref={bottomSheetRef}
                title={title}
                items={items}
                selectedValue={value}
                onPress={(value) => {
                    onPress(value)
                }}
                onDismiss={() => { lastDismissedRef.current = Date.now() }}
            />
        </>
    )
}

export default CustomMultipleInputWithBottomSheet