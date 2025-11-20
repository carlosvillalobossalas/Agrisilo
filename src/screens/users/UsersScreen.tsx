import { Alert, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Dialog, FAB, Portal, Text, TextInput } from 'react-native-paper'
import { useAppSelector } from '../../store'
import CustomButtonWithIconRight from '../../components/CustomButtonWithIconRight'
import { useDispatch } from 'react-redux'
import { createInvite, getAllUsers, sendInviteEmail } from '../../services/auth'
import { setAllUsers, setUserFSNotLogged } from '../../store/slices/authSlice'
import { useNavigation } from '@react-navigation/native'

const UsersScreen = () => {
    const authState = useAppSelector(state => state.authState)
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const [filterValue, setFilterValue] = useState('')
    const [newUserEmail, setNewUserEmail] = useState('')
    const [inviteModalVisible, setInviteModalVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = getAllUsers((data) => {
            console.log('users', data)
            dispatch(setAllUsers(data))
        })
        return () => unsubscribe()
    }, [])

    return (
        <View style={{ flex: 1, gap: 10, paddingVertical: 20, paddingHorizontal: 25 }}>
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
            {
                authState.userFS?.admin && (
                    <FAB
                        icon={'plus'}
                        onPress={() => setInviteModalVisible(true)}
                        style={{
                            position: 'absolute',
                            margin: 16,
                            right: 10,
                            bottom: 20
                        }} />
                )
            }


            <Portal>
                <Dialog
                    visible={inviteModalVisible}
                    onDismiss={() => setInviteModalVisible(false)}
                    style={{ backgroundColor: 'white' }}
                >
                    <Dialog.Title>Invitar usuario</Dialog.Title>

                    <Dialog.Content>
                        <TextInput
                            label="Correo electrónico"
                            mode="outlined"
                            keyboardType="email-address"
                            value={newUserEmail}
                            onChangeText={setNewUserEmail}
                            autoCapitalize="none"
                        />
                    </Dialog.Content>

                    <Dialog.Actions>
                        <Button
                            onPress={() => {
                                setInviteModalVisible(false);
                                setNewUserEmail('');
                            }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            onPress={async () => {
                                if (!newUserEmail.trim()) {
                                    Alert.alert("Correo inválido", "Debes ingresar un correo válido.");
                                    return;
                                }

                                try {
                                    // 1. Crear invitación en Firestore
                                    const code = await createInvite(newUserEmail.trim());

                                    // 2. Enviar correo con el código
                                    await sendInviteEmail(newUserEmail.trim(), code);

                                    // 3. Cerrar modal y limpiar
                                    setInviteModalVisible(false);
                                    setNewUserEmail('');

                                    Alert.alert(
                                        "Invitación enviada",
                                        `Se envió el código a: ${newUserEmail.trim()}`
                                    );
                                } catch (err) {
                                    console.error(err);
                                    Alert.alert("Error", "No se pudo crear la invitación.");
                                }
                            }}
                        >
                            Enviar
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}

export default UsersScreen