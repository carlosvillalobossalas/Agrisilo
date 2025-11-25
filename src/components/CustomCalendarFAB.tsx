import React, { useState } from 'react'
import { FAB, Portal, useTheme } from 'react-native-paper'
import { useIsFocused, useNavigation } from '@react-navigation/native'

const CustomCalendarFAB = () => {

    const theme = useTheme()

    const navigation = useNavigation()
    const isFocused = useIsFocused()

    const [openFAB, setOpenFAB] = useState(false)
    const onFABStateChange = ({ open }: any) => setOpenFAB(open);

    if (!isFocused) return null

    return (
        <Portal >
            <FAB.Group
                icon={openFAB ? 'calendar-today' : 'plus'}
                style={{ position: 'absolute', bottom: 40, right: 5, }}
                visible
                open={openFAB}
                actions={[
                    {
                        label: 'Agregar tarea',
                        icon: 'calendar-plus',
                        onPress: () => { navigation.navigate('EventScreen') },
                        style: { backgroundColor: theme.colors.primaryContainer }
                    },
                    {
                        label: 'Agregar cliente',
                        icon: 'account-group-outline',
                        onPress: () => { navigation.navigate('ClientScreen') },
                        style: { backgroundColor: theme.colors.primaryContainer }
                    },
                    {
                        label: 'Agregar servicio',
                        icon: 'account-wrench-outline',
                        onPress: () => { navigation.navigate('ServiceScreen') },
                        style: { backgroundColor: theme.colors.primaryContainer }
                    },
                    {

                        label: 'Agregar estado',
                        icon: 'check',
                        onPress: () => { navigation.navigate('StatusScreen') },
                        style: { backgroundColor: theme.colors.primaryContainer }
                    },

                    {
                        label: 'Exportar PDF',
                        icon: 'file-pdf-box',
                        onPress: () => {
                            navigation.navigate('EventToPdfScreen')
                        },
                        style: { backgroundColor: theme.colors.primaryContainer }
                    }
                ]}
                onStateChange={onFABStateChange}
            />
        </Portal>
    )
}

export default CustomCalendarFAB