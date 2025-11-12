import { View, Text, StyleProp, TextStyle } from 'react-native'
import React from 'react'
import { Button, Icon } from 'react-native-paper'
import ColorPicker from 'reanimated-color-picker'
interface CustomButtonWithIconRightProps {
    label: string
    icon: string
    mode: string
    labelStyle?: StyleProp<TextStyle>
    children?: React.ReactNode
    onPress?: () => void
}
const CustomButtonWithIconRight = ({ mode, label, icon, children, onPress, labelStyle = {} }: CustomButtonWithIconRightProps) => {
    return (
        <Button
            mode="elevated"
            style={{
                borderRadius: 10,
                width: '100%',
                height: 62,
            }}
            contentStyle={{
                height: 62,
                alignItems: 'center',
                justifyContent: 'flex-start'
            }}
            onPress={onPress}
        >
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 62,
                paddingTop: 5,
                justifyContent: 'space-between',
                width: '95%',
            }}>
                <View
                    style={{
                        width: '100%',
                        gap: 2
                    }}
                >
                    <Text style={{ fontSize: 16, ...labelStyle }}>{label}</Text>
                    {
                        children
                    }
                </View>
                <Icon source={icon} size={20} />
            </View>
        </Button>
    )
}

export default CustomButtonWithIconRight