import React from 'react'
import { Icon, IconButton, Tooltip } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { useAppSelector } from '../store'
import { View } from 'react-native'
import { logoutFB } from '../services/auth'

const LogoutButton = () => {
    const dispatch = useDispatch()

    const handleLogout = async () => {
        const res = await logoutFB()
        if (res)
            dispatch(logout())
    }
    return (
        <View
            style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center', gap: 15 }}

        >
            <IconButton
                icon={"logout"}
                onPress={handleLogout}
                mode="contained"
                size={22}
            />
        </View>
    )
}

export default LogoutButton