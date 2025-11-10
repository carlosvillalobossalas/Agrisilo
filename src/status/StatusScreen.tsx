import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Button, TextInput } from 'react-native-paper'
import CustomColorPicker from '../components/CustomColorPicker'

const StatusScreen = () => {
    const [selectedColor, setSelectedColor] = useState('#ff0000')
    return (
        <View style={{ flex: 1, paddingTop: 10, paddingBottom: 15, paddingHorizontal: 15, gap: 10 }}>

            <View style={{ gap: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Nombre</Text>
                <TextInput placeholder='Ingrese el nombre del estado' mode='outlined' right={<TextInput.Icon icon={'account-outline'} />} />
            </View>


            <View style={{ gap: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Color</Text>
                <CustomColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
            </View>


            <Button style={{ marginTop: 'auto', paddingVertical: 5 }} mode='contained'>
                <Text style={{ fontWeight: 'bold', color: 'white' }}>Guardar estado</Text>
            </Button>
        </View>
    )
}

export default StatusScreen