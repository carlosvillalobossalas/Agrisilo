import { View } from 'react-native'
import React from 'react'
import { Button, Icon, Text } from 'react-native-paper'

interface CustomButtonTwoIconsProps {
    label: string
    iconLeft: string
    iconRight: string
    onPress?: () => void
}

const CustomButtonTwoIcons = ({ label, iconLeft, iconRight, onPress }: CustomButtonTwoIconsProps) => {
    return (
        <Button
            mode="elevated"
            icon={({ size, color }) => (
                <Icon source={iconLeft} size={30} color={color} /> // 👈 controla el tamaño aquí
            )}
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
                <Text style={{ fontSize: 16 }}>{label}</Text>
                <Icon source={iconRight} size={20} />
            </View>
        </Button>
    )
}

export default CustomButtonTwoIcons