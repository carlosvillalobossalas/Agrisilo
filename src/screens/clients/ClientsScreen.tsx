import { View } from 'react-native'
import React from 'react'
import { useAppSelector } from '../../store'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import CustomButtonWithIconRight from '../../components/CustomButtonWithIconRight'
import { setClient } from '../../store/slices/clientSlice'
import { Text } from 'react-native-paper'

const ClientsScreen = () => {
    const clientState = useAppSelector(state => state.clientState)
    const dispatch = useDispatch()

    const navigation = useNavigation()
    return (
        <View style={{ flex: 1, gap: 10, paddingVertical: 20, paddingHorizontal: 25 }}>
            {
                clientState.clients.map((client) => (
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