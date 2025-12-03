import { Alert, TouchableOpacity, View, Pressable, Keyboard } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Button, Text, TextInput } from 'react-native-paper'
import CustomColorPicker from '../../components/CustomColorPicker'
import { Service } from '../../interfaces/services'
import { useDispatch } from 'react-redux'
import { serviceLoading, setService } from '../../store/slices/serviceSlice'
import { deleteService, saveService } from '../../services/services'
import { useAppSelector } from '../../store'
import { useNavigation } from '@react-navigation/native'
import Icon from '@react-native-vector-icons/material-design-icons';

const ServiceScreen = () => {
    const serviceState = useAppSelector(state => state.serviceState)
    const dispatch = useDispatch()

    const navigation = useNavigation()

    const [serviceForm, setServiceForm] = useState<Service>({
        id: '',
        color: '#fff000',
        name: ''
    })

    const handleSubmit = async () => {
        dispatch(serviceLoading(true))
        await saveService(serviceForm)
        dispatch(serviceLoading(false))

        if (!serviceState.loading) {
            navigation.goBack()
        }
    }

    const handleDelete = async () => {
        dispatch(serviceLoading(true))
        await deleteService(serviceForm.id)
        dispatch(setService(null))
        dispatch(serviceLoading(false))
        if (!serviceState.loading) {
            navigation.goBack()
        }
    }

    const confirmDelete = () => {
        Alert.alert(
            "Eliminar servicio",
            "¿Estás seguro de que deseas eliminar este servicio?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: handleDelete }
            ]
        );
    };

    useEffect(() => {
        if (serviceState.service) {
            setServiceForm(serviceState.service)
        }
        return () => {
            dispatch(setService(null))
        }
    }, [serviceState.service])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: serviceForm.id ? 'Modificar servicio' : 'Nuevo servicio',
            headerRight: serviceForm.id
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
    }, [navigation, serviceForm.id])


    return (
        <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <View style={{ flex: 1, paddingTop: 10, paddingBottom: 15, paddingHorizontal: 15, gap: 10 }}>

            <View style={{ gap: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Nombre</Text>
                <TextInput
                    placeholder='Ingrese el nombre del servicio'
                    mode='outlined'
                    right={<TextInput.Icon icon={'account-outline'} />}
                    value={serviceForm.name}
                    onChangeText={(text) => setServiceForm({ ...serviceForm, name: text })}
                />
            </View>


            <View style={{ gap: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Color</Text>
                <CustomColorPicker
                    selectedColor={serviceForm.color}
                    setSelectedColor={(color) => {
                        setServiceForm({ ...serviceForm, color: color.toString() })
                    }}
                />
            </View>


            <Button style={{ marginTop: 'auto', paddingVertical: 5 }} mode='contained' onPress={handleSubmit} loading={serviceState.loading}>
                <Text style={{ fontWeight: 'bold', color: 'white' }}>Guardar servicio</Text>
            </Button>
            </View>
        </Pressable>
    )
}

export default ServiceScreen