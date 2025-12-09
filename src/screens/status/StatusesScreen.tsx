import { View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useAppSelector } from '../../store'
import CustomButtonWithIconRight from '../../components/CustomButtonWithIconRight'
import ColorPicker, { Preview } from 'reanimated-color-picker'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { setStatus } from '../../store/slices/statusSlice'
import { TextInput } from 'react-native-paper'

const StatusesScreen = () => {
    const statusState = useAppSelector(state => state.statusState)
    const dispatch = useDispatch()

    const navigation = useNavigation()

    const [filterValue, setFilterValue] = useState('')

    return (
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
                    statusState.statuses
                    .filter(status => {
                        if (filterValue === '') {
                            return true
                        }
                        return status.name.toLowerCase().includes(filterValue.toLowerCase())
                    })
                    .map((status) => (
                        <CustomButtonWithIconRight
                            key={status.id}
                            mode='elevated'
                            label={status.name}
                            onPress={() => {
                                dispatch(setStatus(status))
                                navigation.navigate('StatusScreen')
                            }}
                            icon='chevron-right'
                            labelStyle={{ fontWeight: 'bold' }}
                        >
                            <ColorPicker
                                value={status.color}
                            >
                                <Preview style={{ width: 100, height: 15 }} hideInitialColor hideText />
                            </ColorPicker>
                        </CustomButtonWithIconRight>
                    ))
                }
            </ScrollView>
        </View >
    )
}

export default StatusesScreen