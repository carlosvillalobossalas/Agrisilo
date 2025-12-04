import { Alert, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Checkbox, IconButton, Text, TextInput } from 'react-native-paper'
import { useAppSelector } from '../../store'
import { useDispatch } from 'react-redux'
import { authLoading } from '../../store/slices/authSlice'
import { saveUser } from '../../services/auth'

const ProfileScreen = () => {
    const authState = useAppSelector(state => state.authState)
    const dispatch = useDispatch()


    const [userForm, setUserForm] = useState({
        id: '',
        name: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        email: '',
        status: 'active',
        admin: false,
    })

    const handleSubmit = async () => {
        try {
            console.log(userForm)
            const { confirmPassword, ...rest } = userForm
            if (userForm.newPassword !== confirmPassword) {
                Alert.alert('Las contraseñas no coinciden')
                return
            }
            dispatch(authLoading(true))
            await saveUser(rest)

            dispatch(authLoading(false))
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        console.log(authState)
        if (authState.user) {
            setUserForm({
                id: authState.user?.uid ?? '',
                name: authState.user?.displayName ?? '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
                email: authState.user?.email ?? '',
                status: 'active',
                admin: authState.userFS?.admin ?? false
            })
        }
    }, [authState.user])


    return (
        <View style={{ flex: 1, paddingTop: 10, paddingBottom: 15, paddingHorizontal: 15, gap: 10 }}>
            <View style={{ gap: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Nombre</Text>
                <TextInput
                    value={userForm.name}
                    onChangeText={(text) => setUserForm({ ...userForm, name: text })}
                    placeholder='Nombre'
                    mode='outlined'
                    right={<TextInput.Icon icon={'account-outline'} />}
                />
            </View>

            <View style={{ gap: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Email</Text>
                <TextInput
                    value={userForm.email}
                    placeholder='Email'
                    mode='outlined'
                    disabled
                    right={<TextInput.Icon icon={'email-outline'} />}
                />
            </View>

            <View style={{ gap: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Contraseña actual</Text>
                <TextInput
                    label="Contraseña actual"
                    mode="outlined"
                    secureTextEntry
                    value={userForm.currentPassword}
                    onChangeText={text => setUserForm({ ...userForm, currentPassword: text })}
                    textContentType="none"
                    autoComplete="off"
                    autoCorrect={false}
                    importantForAutofill="no"
                />
            </View>
            <View style={{ gap: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Nueva contraseña</Text>

                <TextInput
                    label="Nueva contraseña"
                    mode="outlined"
                    secureTextEntry
                    value={userForm.newPassword}
                    onChangeText={text => {
                        setUserForm({ ...userForm, newPassword: text });
                    }}
                    textContentType="none"
                    autoComplete="off"
                    autoCorrect={false}
                    importantForAutofill="no"
                />
            </View>
            <View style={{ gap: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Confirmar contraseña</Text>
                <TextInput
                    label="Confirmar contraseña"
                    mode="outlined"
                    secureTextEntry
                    value={userForm.confirmPassword}
                    onChangeText={text => {
                        setUserForm({ ...userForm, confirmPassword: text });
                    }}
                    textContentType="none"
                    autoComplete="off"
                    autoCorrect={false}
                    importantForAutofill="no"
                />
            </View>

            <Button
                mode="contained"
                loading={authState.loading}
                onPress={handleSubmit}
                style={{ marginTop: 'auto', marginBottom: 20 }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    Guardar cuenta
                </Text>
            </Button>
        </View>
    )
}

export default ProfileScreen