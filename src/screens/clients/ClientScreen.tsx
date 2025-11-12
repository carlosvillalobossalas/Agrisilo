import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import CustomColorPicker from '../../components/CustomColorPicker'
import { Client } from '../../interfaces/client'
import { useAppSelector } from '../../store'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { clientLoading, setClient } from '../../store/slices/clientSlice'
import { saveClient } from '../../services/clients'

const ClientScreen = () => {
  const clientState = useAppSelector(state => state.clientState)
  const dispatch = useDispatch()

  const navigation = useNavigation()

  const [clientForm, setClientForm] = useState<Client>({
    id: '',
    name: '',
    email: '',
    area: 0,
    phone: 0,
    location: '',
    color: '#FF0000'
  })

  const handleSubmit = async () => {
    dispatch(clientLoading(true))
    await saveClient(clientForm)
    dispatch(clientLoading(false))

    if (!clientState.loading) {
      navigation.goBack()
    }
  }


  useEffect(() => {
    if (clientState.client) {
      setClientForm(clientState.client)
    }
    return () => {
      dispatch(setClient(null))
    }
  }, [clientState.client])

  return (
    <View style={{ flex: 1, paddingTop: 10, paddingBottom: 15, paddingHorizontal: 15, gap: 10 }}>

      <View style={{ gap: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>Nombre</Text>
        <TextInput
          value={clientForm.name}
          onChangeText={(text) => setClientForm({ ...clientForm, name: text })}
          placeholder='Ingrese el nombre del cliente'
          mode='outlined'
          right={<TextInput.Icon icon={'account-outline'} />}
        />
      </View>

      <View style={{ gap: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>Correo Electronico</Text>
        <TextInput
          value={clientForm.email}
          inputMode='email'
          autoCapitalize='none'
          onChangeText={(text) => setClientForm({ ...clientForm, email: text })}
          placeholder='ejemplo@gmail.com'
          mode='outlined'
          right={<TextInput.Icon icon={'email-outline'} />}
        />
      </View>

      <View style={{ gap: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>Area (hectáreas)</Text>
        <TextInput
          value={clientForm.area.toString()}
          onChangeText={(text) => {
            if (text !== '')
              setClientForm({ ...clientForm, area: parseFloat(text) })
          }}
          inputMode='numeric'
          placeholder='0'
          mode='outlined'
          right={<TextInput.Icon icon={'terrain'} />}
        />
      </View>

      <View style={{ gap: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>Número de teléfono</Text>
        <TextInput
          value={clientForm.phone.toString()}
          onChangeText={(text) => {
            if (text !== '')
              setClientForm({ ...clientForm, phone: parseInt(text) })
          }}
          inputMode='numeric'
          placeholder='Ingrese el número de teléfono'
          mode='outlined'
          right={<TextInput.Icon icon={'phone-outline'} />}
        />
      </View>

      <View style={{ gap: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>Ubicación del terreno</Text>
        <TextInput
          value={clientForm.location}
          onChangeText={(text) => setClientForm({ ...clientForm, location: text })}
          placeholder='Ingrese la ubicación del terreno'
          mode='outlined'
          right={<TextInput.Icon icon={'map-marker-outline'} />}
        />
      </View>

      <View style={{ gap: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>Color</Text>
        <CustomColorPicker
          selectedColor={clientForm.color}
          setSelectedColor={(color) => {
            setClientForm({ ...clientForm, color: color.toString() })
          }}
        />
      </View>

      <Button style={{ marginTop: 'auto', paddingVertical: 5 }} mode='contained' onPress={handleSubmit} loading={clientState.loading}>
        <Text style={{ fontWeight: 'bold', color: 'white' }}>Guardar cliente</Text>
      </Button>
    </View>
  )
}

export default ClientScreen