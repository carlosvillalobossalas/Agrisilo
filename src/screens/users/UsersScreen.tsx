import { Alert, View, ScrollView, Pressable, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { FAB, Text, TextInput } from 'react-native-paper'
import { useAppSelector } from '../../store'
import CustomButtonWithIconRight from '../../components/CustomButtonWithIconRight'
import { useDispatch } from 'react-redux'
import { createInvite, sendInviteEmail } from '../../services/auth'
import { setUserFSNotLogged } from '../../store/slices/authSlice'
import { useNavigation } from '@react-navigation/native'

const UsersScreen = () => {
    const authState = useAppSelector(state => state.authState)
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const [filterValue, setFilterValue] = useState('')



    const handleInviteUser = () => {
        Alert.prompt(
            'Invitar usuario',
            'Ingresa el correo electrónico',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Enviar',
                    onPress: async (email?: string) => {
                        if (!email?.trim()) {
                            Alert.alert('Correo inválido', 'Debes ingresar un correo válido.');
                            return;
                        }

                        try {
                            const code = await createInvite(email.trim());
                            await sendInviteEmail(email.trim(), code);
                            Alert.alert(
                                'Invitación enviada',
                                `Se envió el código a: ${email.trim()}`
                            );
                        } catch (err) {
                            console.error(err);
                            Alert.alert('Error', 'No se pudo crear la invitación.');
                        }
                    },
                },
            ],
            'plain-text',
            '',
            'default'
        );
    }

    return (
        <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>

            <View style={{ flex: 1, paddingVertical: 20, paddingHorizontal: 25 }}>
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
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 10 }} showsVerticalScrollIndicator={false}>
                    {
                        authState.users
                            .filter(user => {
                                if (user.email === authState.user?.email) return false
                                if (filterValue === '') {
                                    return true
                                }
                                console.log(user)
                                console.log(authState)
                                return user.name.toLowerCase().includes(filterValue.toLowerCase())
                            })
                            .map((user) => (
                                <CustomButtonWithIconRight
                                    key={user.id}
                                    mode='elevated'
                                    label={user.name}
                                    onPress={authState.userFS?.admin ?
                                        () => {
                                            navigation.navigate('UserScreen')
                                            dispatch(setUserFSNotLogged(user))
                                        }
                                        : undefined}
                                    icon={authState.userFS?.admin ? 'chevron-right' : 'none'}
                                    labelStyle={{ fontWeight: 'bold' }}
                                >
                                    <Text>{user.email}</Text>
                                </CustomButtonWithIconRight>
                            ))
                    }
                </ScrollView>
                {
                    authState.userFS?.admin && (
                        <FAB
                            icon={'plus'}
                            onPress={handleInviteUser}
                            style={{
                                position: 'absolute',
                                margin: 16,
                                right: 10,
                                bottom: 20
                            }} />
                    )
                }
            </View>
        </Pressable>

    )
}

export default UsersScreen