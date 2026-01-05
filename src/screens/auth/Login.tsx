import React, { useState } from 'react'
import { Alert, Image, Keyboard, Pressable, View } from 'react-native'
import { Button, Text, TextInput, useTheme, } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { sendPasswordResetEmail, signIn, validateInviteCode } from '../../services/auth'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { loginFailure, loginStart, loginSuccess, setCodeAndInitialData } from '../../store/slices/authSlice'
import { useAppSelector } from '../../store'

const Login = () => {
    const { colors, fonts } = useTheme()

    const navigation = useNavigation();
    const authState = useAppSelector(state => state.authState)
    const dispatch = useDispatch()

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    })

    const handleLogin = async () => {
        try {
            dispatch(loginStart())
            const user = await signIn(loginForm.email, loginForm.password)
            dispatch(loginSuccess(user))

        } catch (error: any) {
            dispatch(loginFailure(error))
            console.error(error)
            
            // Mostrar mensaje de error al usuario
            let errorMessage = 'Ocurrió un error al iniciar sesión.';
            
            if (error?.code === 'auth/invalid-credential' || error?.code === 'auth/wrong-password') {
                errorMessage = 'Correo o contraseña incorrectos.';
            } else if (error?.code === 'auth/user-not-found') {
                errorMessage = 'No existe una cuenta con este correo.';
            } else if (error?.code === 'auth/invalid-email') {
                errorMessage = 'El correo electrónico no es válido.';
            } else if (error?.code === 'auth/user-disabled') {
                errorMessage = 'Esta cuenta ha sido deshabilitada.';
            } else if (error?.code === 'auth/too-many-requests') {
                errorMessage = 'Demasiados intentos fallidos. Intenta más tarde.';
            } else if (error?.message) {
                errorMessage = error.message;
            }
            
            Alert.alert('Error de inicio de sesión', errorMessage);
        }
    }

    const handleInviteCode = () => {
        Alert.prompt(
            'Crear cuenta',
            'Ingresa tu código de verificación',
            [
                {
                    text: 'Cancelar',
                    onPress: () => { },
                    style: 'cancel',
                },
                {
                    text: 'Validar',
                    onPress: async (code?: string) => {
                        if (!code?.trim()) {
                            Alert.alert('Error', 'Debes ingresar un código.');
                            return;
                        }

                        const result = await validateInviteCode(code.trim().toUpperCase());

                        if (!result.valid) {
                            Alert.alert('Error', result.reason ?? '');
                            return;
                        }

                        // Código válido -> navegar
                        dispatch(setCodeAndInitialData({
                            code: code.trim().toUpperCase(),
                            inviteData: result?.data ?? undefined
                        }))
                        navigation.navigate('SignUp');
                    },
                },
            ],
            'plain-text',
            '',
            'default'
        );
    }

    const handlePasswordRecovery = () => {
        Alert.prompt(
            'Recuperar contraseña',
            'Ingresa tu correo electrónico',
            [
                {
                    text: 'Cancelar',
                    onPress: () => { },
                    style: 'cancel',
                },
                {
                    text: 'Enviar',
                    onPress: async (email?: string) => {
                        if (!email?.trim()) {
                            Alert.alert('Error', 'Debes ingresar un correo electrónico.');
                            return;
                        }

                        const sent = await sendPasswordResetEmail(email.trim());
                        if (!sent) {
                            Alert.alert('Error', 'Ocurrió un error al enviar el correo. Verifica que el correo sea correcto.');
                        } else {
                            Alert.alert('Correo enviado', 'Se ha enviado un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.');
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
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={{
                alignItems: 'center',
                paddingTop: 20,
                flex: 1,
                backgroundColor: colors.background,
                gap: 20,
            }}>
                <Image
                    source={require('../../assets/images/1024.png')}
                    style={{ height: 180, resizeMode: 'contain' }}
                    accessibilityLabel="Agrisilo logo"
                />
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
                        <Button style={{ alignSelf: 'flex-end' }} onPress={handlePasswordRecovery}>
                            <Text style={{ fontWeight: 'bold', color: colors.primary }} >
                                ¿Olvidaste tu contraseña?
                            </Text>
                        </Button>
                        <Button style={{ alignSelf: 'flex-end' }} onPress={handleInviteCode}>
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
                    <Text style={{ color: colors.surface, fontSize: fonts.titleMedium.fontSize, fontWeight: 'bold' }}>
                        Iniciar sesión
                    </Text>
                </Button>
            </SafeAreaView >
        </Pressable>
    )
}

export default Login