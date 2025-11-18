import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signUp, markInviteAsUsed } from '../../services/auth'; // Ajusta el path si es diferente
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppSelector } from '../../store';
import { clearInviteState } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';

const SignUpScreen = () => {
  const { colors } = useTheme();

  const navigation = useNavigation();
  const dispatch = useDispatch()

  const { code, inviteData } = useAppSelector(state => state.authState)

  const [name, setName] = useState('');
  const [email, setEmail] = useState(inviteData?.email || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');

    // Validaciones
    if (!name.trim()) {
      setError("Debes ingresar tu nombre.");
      return;
    }

    if (!email.trim()) {
      setError("Debes ingresar un correo.");
      return;
    }

    if (!password.trim()) {
      setError("Debes ingresar una contraseña.");
      return;
    }

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      // Crear usuario en Auth + Firestore
      await signUp(email.trim(), password.trim(), name.trim());

      // Marcar invitación como usada
      await markInviteAsUsed(code);

      setLoading(false);

      // Navegar al login
      dispatch(clearInviteState());
      navigation.navigate('Login');

    } catch (err: any) {
      console.error(err);
      setLoading(false);
      setError("Hubo un error al crear la cuenta.");
    }
  };

  if (!inviteData || !code) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Debes ingresar con un código de invitación válido.</Text>
        <Button onPress={() => navigation.goBack()}>Volver</Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, }}
      >
        <View style={{
          flex: 1,
          paddingHorizontal: 20,
          gap: 15
        }}>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold', marginBottom: 10 }}>
            Crear cuenta
          </Text>

          <TextInput
            label="Nombre completo"
            mode="outlined"
            value={name}
            onChangeText={text => {
              setName(text);
              setError('');
            }}
          />

          <TextInput
            label="Correo electrónico"
            mode="outlined"
            value={email}
            onChangeText={text => {
              // Si en la invitación venía un email, lo bloqueamos
              if (!inviteData?.email) setEmail(text);
              setError('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!inviteData?.email} // <- bloquea el campo si el admin asignó email
          />

          <TextInput
            label="Contraseña"
            mode="outlined"
            secureTextEntry
            value={password}
            onChangeText={text => {
              setPassword(text);
              setError('');
            }}
          />

          <TextInput
            label="Confirmar contraseña"
            mode="outlined"
            secureTextEntry
            value={confirm}
            onChangeText={text => {
              setConfirm(text);
              setError('');
            }}
          />

          {error ? (
            <Text style={{ color: 'red', marginTop: -5 }}>{error}</Text>
          ) : null}

          <Button
            mode="contained"
            loading={loading}
            onPress={handleRegister}
            style={{ marginTop: 10 }}
          >
            Crear cuenta
          </Button>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
