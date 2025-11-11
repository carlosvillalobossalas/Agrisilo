import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Button, TextInput } from 'react-native-paper'
import CustomColorPicker from '../../components/CustomColorPicker'
import { useDispatch } from 'react-redux'
import { statusLoading } from '../../store/slices/statusSlice'
import { saveStatus } from '../../services/status'
import { Status } from '../../interfaces/status'
import { useAppSelector } from '../../store'
import { useNavigation } from '@react-navigation/native'

const StatusScreen = () => {
    const statusState = useAppSelector(state => state.statusState)
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const [statusForm, setStatusForm] = useState<Status>({
        id: '',
        color: '#fff000',
        name: ''
    })

    const handleSubmit = async () => {
        dispatch(statusLoading(true))
        await saveStatus(statusForm)
        dispatch(statusLoading(false))

        if (!statusState.loading) {
            navigation.goBack()
        }

    }

    return (
        <View style={{ flex: 1, paddingTop: 10, paddingBottom: 15, paddingHorizontal: 15, gap: 10 }}>

            <View style={{ gap: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Nombre</Text>
                <TextInput
                    placeholder='Ingrese el nombre del estado'
                    value={statusForm.name}
                    onChangeText={(text) => setStatusForm({ ...statusForm, name: text })}
                    mode='outlined'
                    right={<TextInput.Icon icon={'account-outline'} />}
                />
            </View>


            <View style={{ gap: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Color</Text>
                <CustomColorPicker
                    selectedColor={statusForm.color}
                    setSelectedColor={(color) => {
                        setStatusForm({ ...statusForm, color: color.toString() })
                    }} />
            </View>


            <Button style={{ marginTop: 'auto', paddingVertical: 5 }} mode='contained' onPress={handleSubmit} loading={statusState.loading}>
                <Text style={{ fontWeight: 'bold', color: 'white' }}>Guardar estado</Text>
            </Button>
        </View>
    )
}

export default StatusScreen