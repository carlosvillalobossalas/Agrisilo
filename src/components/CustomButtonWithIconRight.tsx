import { View, Text, StyleProp, TextStyle, ViewStyle } from 'react-native'
import React from 'react'
import { Button, Icon } from 'react-native-paper'

interface CustomButtonWithIconRightProps {
    label: string
    icon: string
    mode?: "elevated" | "text" | "outlined" | "contained" | "contained-tonal" | undefined
    labelStyle?: StyleProp<TextStyle>
    children?: React.ReactNode
    style?: StyleProp<ViewStyle>
    contentStyle?: StyleProp<ViewStyle>
    disabled?: boolean
    onPress?: () => void
}
const CustomButtonWithIconRight = ({ mode = 'elevated', label, icon, children, style, disabled = false, contentStyle, onPress, labelStyle = {} }: CustomButtonWithIconRightProps) => {
    return (
        <Button
            mode={mode}
            disabled={disabled}
            style={{
                borderRadius: 10,
                width: '100%',
                height: 62,
                backgroundColor: 'white',
                ...style,
            }}
            contentStyle={{
                height: 62,
                alignItems: 'center',
                justifyContent: 'flex-start',
                ...contentStyle,
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
                    <Text style={{
                        fontSize: 16,
                        ...labelStyle
                    }}>{label}</Text>
                    {
                        children
                    }
                </View>
                {
                    icon !== 'none' && (
                        <Icon source={icon} size={20} />
                    )
                }
            </View>
        </Button>
    )
}

export default CustomButtonWithIconRight