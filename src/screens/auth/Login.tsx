import React from 'react'
import { Keyboard, Pressable, View } from 'react-native'
import { Button, Text, TextInput, useTheme, } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { signIn } from '../../services/auth'

const Login = () => {
    const { colors, fonts } = useTheme()
    return (
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={{
                alignItems: 'center',
                paddingTop: 20,
                flex: 1,
                backgroundColor: colors.background,
                gap: 20,
            }}>
                <Text variant='headlineMedium' style={{ fontWeight: 'bold' }}>Iniciar sesión</Text>
                <View style={{ width: '100%', alignItems: 'center', gap: 10 }}>
                    <TextInput left={<TextInput.Icon icon="account-outline" />} label={'Cédula'} mode='outlined' style={{ width: '90%', }} />
                    <TextInput left={<TextInput.Icon icon="lock-outline" />} label={'Contraseña'} mode='outlined' style={{ width: '90%', }} />
                    <Button style={{ alignSelf: 'flex-end' }}>
                        <Text style={{ fontWeight: 'bold', color: colors.primary }} >
                            ¿Olvidaste tu contraseña?
                        </Text>
                    </Button>
                </View>

                <Button mode='contained' style={{ borderRadius: 5, width: '90%', padding: 4 }} onPress={() => {
                    signIn('carlosvillalobos247@gmail.com', 'carlos')
                }}>
                    <Text style={{ color: colors.onPrimary, fontSize: fonts.titleMedium.fontSize, fontWeight: 'bold' }}>
                        Iniciar sesión
                    </Text>
                </Button>
            </SafeAreaView >
        </Pressable>
    )
}

export default Login