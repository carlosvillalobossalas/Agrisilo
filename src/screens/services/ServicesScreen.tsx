import { View, ScrollView, Pressable, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { useAppSelector } from '../../store'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import CustomButtonWithIconRight from '../../components/CustomButtonWithIconRight'
import ColorPicker, { Preview } from 'reanimated-color-picker'
import { setService } from '../../store/slices/serviceSlice'
import { TextInput } from 'react-native-paper'

const ServicesScreen = () => {
    const serviceState = useAppSelector(state => state.serviceState)
    const dispatch = useDispatch()

    const navigation = useNavigation()

    const [filterValue, setFilterValue] = useState('')

    return (
        <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>

            <View style={{ flex: 1, paddingVertical: 20, paddingHorizontal: 25 }}>
                <TextInput
                    mode='flat'
                    left={<TextInput.Icon icon={'magnify'} />}
                    label={'Buscar por nombre'}
                    value={filterValue}
                    onChangeText={(text) => setFilterValue(text)}
                    style={{
                        marginBottom: 10,
                        backgroundColor: 'white',
                        paddingVertical: 5,
                        borderRadius: 10
                    }}
                />
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 10 }} showsVerticalScrollIndicator={false}>
                    {
                        serviceState.services
                            .filter(service => {
                                if (filterValue === '') {
                                    return true
                                }
                                return service.name.toLowerCase().includes(filterValue.toLowerCase())
                            })
                            .map((service) => (
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
                </ScrollView>
            </View >
        </Pressable>

    )
}

export default ServicesScreen