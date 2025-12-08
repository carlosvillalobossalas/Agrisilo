import { View } from 'react-native'
import React from 'react'
import { Button, Icon, Text } from 'react-native-paper'
import CustomButtonTwoIcons from '../../components/CustomButtonTwoIcons'
import { useDispatch } from 'react-redux'
import { logoutFB } from '../../services/auth'
import { logout } from '../../store/slices/authSlice'
import { useNavigation } from '@react-navigation/native'

const ConfigScreen = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const handleLogout = async () => {
    const res = await logoutFB()
    if (res)
      dispatch(logout())
  }
  return (
    <View style={{ flex: 1, paddingVertical: 30, paddingHorizontal: 20, gap: 10 }}>
      <CustomButtonTwoIcons label={'Mi Perfil'} iconLeft={"account-circle-outline"} iconRight={"chevron-right"} onPress={() => { navigation.navigate('ProfileScreen') }} />
      <View style={{ height: 20 }} />
      <CustomButtonTwoIcons label={'Lista de usuarios'} iconLeft={"account-multiple-outline"} iconRight={"chevron-right"} onPress={() => { navigation.navigate('UsersScreen') }} />
      <CustomButtonTwoIcons label={'Lista de servicios'} iconLeft={"account-wrench-outline"} iconRight={"chevron-right"} onPress={() => { navigation.navigate('ServicesScreen') }} />
      <CustomButtonTwoIcons label={'Lista de estados'} iconLeft={"list-status"} iconRight={"chevron-right"} onPress={() => { navigation.navigate('StatusesScreen') }} />
      <CustomButtonTwoIcons label={'Lista de clientes'} iconLeft={"account-group-outline"} iconRight={"chevron-right"} onPress={() => { navigation.navigate('ClientsScreen') }} />

      <Button
        style={{
          marginTop: 20,
          borderRadius: 10,
          width: '100%',
          height: 62,
          backgroundColor: 'white',
        }}
        contentStyle={{
          height: 62,
          alignItems: 'center', // centra verticalmente el icon y texto
          justifyContent: 'flex-start'
        }}
        mode='elevated'

        icon={({ size, color }) => (
          <Icon source={'logout'} size={30} color={'red'} /> // 👈 controla el tamaño aquí
        )}
        onPress={handleLogout}
      >
        <Text style={{ fontWeight: 'bold', color: 'red', fontSize: 16 }}>Cerrar sesión</Text>
      </Button>
    </View >
  )
}

export default ConfigScreen