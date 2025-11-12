import { View } from 'react-native'
import React from 'react'
import { useAppSelector } from '../../store'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import CustomButtonWithIconRight from '../../components/CustomButtonWithIconRight'
import ColorPicker, { Preview } from 'reanimated-color-picker'
import { setService } from '../../store/slices/serviceSlice'

const ServicesScreen = () => {
    const serviceState = useAppSelector(state => state.serviceState)
    const dispatch = useDispatch()

    const navigation = useNavigation()
    return (
        <View style={{ flex: 1, gap: 10, paddingVertical: 20, paddingHorizontal: 25 }}>
            {
                serviceState.services.map((service) => (
                    <CustomButtonWithIconRight
                        key={service.id}
                        mode='elevated'
                        label={service.name}
                        onPress={() => {
                            dispatch(setService(service))
                            navigation.navigate('ServiceScreen')
                        }}
                        icon='chevron-right'
                        labelStyle={{ fontWeight: 'bold' }}
                    >
                        <ColorPicker
                            value={service.color}
                        >
                            <Preview style={{ width: 100, height: 15 }} hideInitialColor hideText />
                        </ColorPicker>
                    </CustomButtonWithIconRight>
                ))
            }
        </View >
    )
}

export default ServicesScreen