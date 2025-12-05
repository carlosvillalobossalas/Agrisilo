import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Alert, TouchableOpacity, View, Pressable, Keyboard } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import CustomColorPicker from '../../components/CustomColorPicker'
import { Client } from '../../interfaces/client'
import { useAppSelector } from '../../store'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { clientLoading, setClient } from '../../store/slices/clientSlice'
import { deleteClient, saveClient } from '../../services/clients'
import Icon from '@react-native-vector-icons/material-design-icons';

const ClientScreen = () => {


  const clientState = useAppSelector(state => state.clientState)
  const dispatch = useDispatch()

  const navigation = useNavigation()

  const [clientForm, setClientForm] = useState<Client>({
    id: '',
    name: '',
    email: '',
    phone: 0,
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


  const handleDelete = async () => {
    dispatch(clientLoading(true))
    await deleteClient(clientForm.id)
    dispatch(setClient(null))
    dispatch(clientLoading(false))
    if (!clientState.loading) {
      navigation.goBack()
    }
  }

  const confirmDelete = () => {
    Alert.alert(
      "Eliminar cliente",
      "¿Estás seguro de que deseas eliminar este cliente?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: handleDelete }
      ]
    );
  };

  useEffect(() => {
    if (clientState.client) {
      setClientForm(clientState.client)
    }
    return () => {
      dispatch(setClient(null))
    }
  }, [clientState.client])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: clientForm.id ? 'Modificar cliente' : 'Nuevo cliente',
      headerRight: clientForm.id
        ? () => (
          <TouchableOpacity
            onPress={confirmDelete}
            style={{
              padding: 5,
              borderRadius: 20,
            }}
          >
            <Icon name="delete-outline" size={26} color="#000" />
          </TouchableOpacity>
        )
        : undefined
    })
  }, [navigation, clientForm.id])

  return (
    <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
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
    </Pressable>
  )
}

export default ClientScreen