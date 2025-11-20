import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../store'
import { User } from '../../interfaces/auth'
import { Button, IconButton, TextInput } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { authLoading } from '../../store/slices/authSlice'
import { updateUser } from '../../services/auth'

const UserScreen = () => {
    const authState = useAppSelector(state => state.authState)
    const dispatch = useDispatch()
    const [userForm, setUserForm] = useState<User | null>(null)

    useEffect(() => {
        console.log(authState.userFSNotLogged)
        setUserForm(authState.userFSNotLogged)
    }, [authState.userFSNotLogged])

    const handleSubmit = async () => {
        try {
            if (!userForm) return
            console.log(userForm)
            dispatch(authLoading(true))
            await updateUser(userForm)

            dispatch(authLoading(false))
        } catch (error) {
            console.error(error)
        }
    }

    if (!userForm) return null


    return (
        <View style={{ flex: 1, paddingTop: 10, paddingBottom: 15, paddingHorizontal: 15, gap: 10 }}>
            <View style={{ gap: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Nombre</Text>
                <TextInput
                    value={userForm.name}
                    onChangeText={(text) => setUserForm({ ...userForm, name: text })}
                    placeholder='Nombre'
                    mode='outlined'
                    disabled
                    right={<TextInput.Icon icon={'account-outline'} />}
                />
            </View>

            <View style={{ gap: 5, flexDirection: 'row', alignItems: 'center' }}>
                <IconButton
                    icon={userForm.status === 'active' ? 'check-circle' : 'circle-outline'}
                    size={24}
                    iconColor={userForm.status === 'active' ? '#0A84FF' : '#C0C0C0'}
                    onPress={() => {
                        setUserForm({ ...userForm, status: userForm.status === 'active' ? 'inactive' : 'active' })
                    }}
                    style={{ margin: 0 }}
                />
                <Text style={{ fontWeight: 'bold' }}>Usuario activo?</Text>
            </View>

            <View style={{ gap: 5, flexDirection: 'row', alignItems: 'center' }}>
                <IconButton
                    icon={userForm.admin ? 'check-circle' : 'circle-outline'}
                    size={24}
                    iconColor={userForm.admin ? '#0A84FF' : '#C0C0C0'}
                    onPress={() => {
                        setUserForm({ ...userForm, admin: !userForm.admin })
                    }}
                    style={{ margin: 0 }}
                />
                <Text style={{ fontWeight: 'bold' }}>Administrador?</Text>
            </View>

            <Button
                mode="contained"
                loading={authState.loading}
                onPress={handleSubmit}
                style={{ marginTop: 'auto', marginBottom: 20 }}
            >
                Guardar cuenta
            </Button>
        </View>
    )
}

export default UserScreen