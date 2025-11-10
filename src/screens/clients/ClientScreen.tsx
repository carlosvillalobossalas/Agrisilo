import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import CustomColorPicker from '../../components/CustomColorPicker'

const ClientScreen = () => {
  const [selectedColor, setSelectedColor] = useState('#FF0000')
  return (
    <View style={{ flex: 1, paddingTop: 10, paddingBottom: 15, paddingHorizontal: 15, gap: 10 }}>

      <View style={{ gap: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>Nombre</Text>
        <TextInput placeholder='Ingrese el nombre del cliente' mode='outlined' right={<TextInput.Icon icon={'account-outline'} />} />
      </View>

      <View style={{ gap: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>Correo Electronico</Text>
        <TextInput placeholder='ejemplo@gmail.com' mode='outlined' right={<TextInput.Icon icon={'email-outline'} />} />
      </View>

      <View style={{ gap: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>Area (hectáreas)</Text>
        <TextInput placeholder='0' mode='outlined' right={<TextInput.Icon icon={'terrain'} />} />
      </View>

      <View style={{ gap: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>Número de teléfono</Text>
        <TextInput placeholder='Ingrese el número de teléfono' mode='outlined' right={<TextInput.Icon icon={'phone-outline'} />} />
      </View>

      <View style={{ gap: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>Ubicación del terreno</Text>
        <TextInput placeholder='Ingrese la ubicación del terreno' mode='outlined' right={<TextInput.Icon icon={'map-marker-outline'} />} />
      </View>

      <View style={{ gap: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>Color</Text>
        <CustomColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
      </View>

      <Button style={{ marginTop: 'auto', paddingVertical: 5 }} mode='contained'>
        <Text style={{ fontWeight: 'bold', color: 'white' }}>Guardar cliente</Text>
      </Button>
    </View>
  )
}

export default ClientScreen