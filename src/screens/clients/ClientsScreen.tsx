import { View } from 'react-native'
import React, { useState } from 'react'
import { useAppSelector } from '../../store'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import CustomButtonWithIconRight from '../../components/CustomButtonWithIconRight'
import { setClient } from '../../store/slices/clientSlice'
import { Text, TextInput } from 'react-native-paper'

const ClientsScreen = () => {
    const clientState = useAppSelector(state => state.clientState)
    const dispatch = useDispatch()

    const navigation = useNavigation()

    const [filterValue, setFilterValue] = useState('')

    return (
        <View style={{ flex: 1, gap: 10, paddingVertical: 20, paddingHorizontal: 25 }}>
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
            {
                clientState.clients
                    .filter(client => {
                        if (filterValue === '') {
                            return true
                        }
                        return client.name.toLowerCase().includes(filterValue.toLowerCase())
                    })
                    .map((client) => (
                        <CustomButtonWithIconRight
                            key={client.id}
                            mode='elevated'
                            label={client.name}
                            onPress={() => {
                                dispatch(setClient(client))
                                navigation.navigate('ClientScreen')
                            }}
                            icon='chevron-right'
                            labelStyle={{ fontWeight: 'bold' }}
                        >
                            <Text>{client.location}</Text>
                        </CustomButtonWithIconRight>
                    ))
            }
        </View >
    )
}

export default ClientsScreen