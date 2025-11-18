import React, { useState } from 'react'
import { Keyboard, Pressable, View } from 'react-native'
import { Button, Dialog, Portal, Text, TextInput, useTheme, } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { signIn, validateInviteCode } from '../../services/auth'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { loginFailure, loginStart, loginSuccess, setCodeAndInitialData } from '../../store/slices/authSlice'
import { useAppSelector } from '../../store'

const Login = () => {
    const { colors, fonts } = useTheme()

    const navigation = useNavigation();
    const authState = useAppSelector(state => state.authState)
    const dispatch = useDispatch()

    const [signUpCode, setSignUpCode] = useState('')
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [inviteError, setInviteError] = useState('');
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    })

    const handleLogin = async () => {
        try {
            dispatch(loginStart())
            const user = await signIn(loginForm.email, loginForm.password)
            dispatch(loginSuccess(user))

        } catch (error) {
            dispatch(loginFailure(error))
            console.error(error)
        }
    }

    return (
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={{
                alignItems: 'center',
                paddingTop: 20,
                flex: 1,
                backgroundColor: colors.background,
                gap: 20,
            }}>
                <Text variant='headlineMedium' style={{ fontWeight: 'bold' }}>Agrisilo</Text>
                <View style={{ width: '100%', alignItems: 'center', gap: 10 }}>
                    <TextInput
                        left={<TextInput.Icon icon="account-outline" />}
                        label={'Correo'}
                        keyboardType='email-address'
                        autoCapitalize='none'
                        mode='outlined'
                        style={{ width: '90%', }}
                        value={loginForm.email}
                        onChangeText={text => {
                            setLoginForm({ ...loginForm, email: text })
                        }}
                    />
                    <TextInput
                        left={<TextInput.Icon icon="lock-outline" />}
                        label={'Contraseña'}
                        mode='outlined'
                        style={{ width: '90%', }}
                        value={loginForm.password}
                        onChangeText={text => {
                            setLoginForm({ ...loginForm, password: text })
                        }}
                        secureTextEntry
                    />
                    <View style={{ alignItems: 'flex-end', width: '100%' }}>
                        <Button style={{ alignSelf: 'flex-end' }}>
                            <Text style={{ fontWeight: 'bold', color: colors.primary }} >
                                ¿Olvidaste tu contraseña?
                            </Text>
                        </Button>
                        <Button style={{ alignSelf: 'flex-end' }} onPress={() => { setInviteModalVisible(true) }}>
                            <Text style={{ fontWeight: 'bold', color: colors.primary }} >
                                Crear cuenta
                            </Text>
                        </Button>
                    </View>
                </View>

                <Button
                    mode='contained'
                    loading={authState.loading}
                    style={{ borderRadius: 5, width: '90%', padding: 4 }}
                    onPress={() => {
                        if (loginForm.email !== '' && loginForm.password !== '') {
                            handleLogin()
                        }
                    }}>
                    <Text style={{ color: colors.onPrimary, fontSize: fonts.titleMedium.fontSize, fontWeight: 'bold' }}>
                        Iniciar sesión
                    </Text>
                </Button>

                <Portal>
                    <Dialog
                        visible={inviteModalVisible}
                        onDismiss={() => {
                            setInviteModalVisible(false);
                            setInviteError('');
                            setSignUpCode('');
                        }}
                        style={{ backgroundColor: 'white' }}
                    >
                        <Dialog.Title>Validar código</Dialog.Title>

                        <Dialog.Content>
                            <TextInput
                                label="Código de verificación"
                                mode="outlined"
                                value={signUpCode}
                                onChangeText={text => {
                                    setSignUpCode(text);
                                    setInviteError('');
                                }}
                                autoCapitalize="characters"
                            />

                            {inviteError ? (
                                <Text style={{ color: 'red', marginTop: 5 }}>{inviteError}</Text>
                            ) : null}
                        </Dialog.Content>

                        <Dialog.Actions>
                            <Button
                                onPress={() => {
                                    setInviteModalVisible(false);
                                    setSignUpCode('');
                                    setInviteError('');
                                }}
                            >
                                Cancelar
                            </Button>

                            <Button
                                onPress={async () => {
                                    setInviteError('');

                                    if (!signUpCode.trim()) {
                                        setInviteError("Debes ingresar un código.");
                                        return;
                                    }

                                    const result = await validateInviteCode(
                                        signUpCode.trim().toUpperCase()
                                    );

                                    if (!result.valid) {
                                        setInviteError(result.reason ?? '');
                                        return; // No cerrar el modal
                                    }

                                    // Código válido -> cerrar modal y navegar
                                    setInviteModalVisible(false);
                                    dispatch(setCodeAndInitialData({
                                        code: signUpCode.trim().toUpperCase(),
                                        inviteData: result?.data ?? undefined
                                    }))
                                    navigation.navigate('SignUp');

                                    setSignUpCode('');
                                }}
                            >
                                Confirmar
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </SafeAreaView >
        </Pressable>
    )
}

export default Login