import React, { useState } from 'react'
import { FAB, Portal } from 'react-native-paper'
import { useIsFocused, useNavigation } from '@react-navigation/native'

const CustomCalendarFAB = () => {

    const navigation = useNavigation()
    const isFocused = useIsFocused()

    const [openFAB, setOpenFAB] = useState(false)
    const onFABStateChange = ({ open }: any) => setOpenFAB(open);

    if (!isFocused) return null

    return (
        <Portal >
            <FAB.Group
                icon={openFAB ? 'calendar-today' : 'plus'}
                style={{ position: 'absolute', bottom: 40, right: 5 }}
                visible
                open={openFAB}
                actions={[
                    {
                        label: 'Agregar tarea', icon: 'calendar-plus', onPress: () => { navigation.navigate('EventScreen') }
                    },
                    {
                        label: 'Agregar cliente', icon: 'account-group-outline', onPress: () => { navigation.navigate('ClientScreen') }
                    },
                    {
                        label: 'Agregar servicio', icon: 'account-wrench-outline', onPress: () => { navigation.navigate('ServiceScreen') }
                    },
                    {
                        label: 'Agregar estado', icon: 'check', onPress: () => { navigation.navigate('StatusScreen') }
                    },

                    {
                        label: 'Exportar PDF', icon: 'file-pdf-box', onPress: () => {
                            navigation.navigate('EventToPdfScreen')
                        }
                    }
                ]}
                onStateChange={onFABStateChange}
            />
        </Portal>
    )
}

export default CustomCalendarFAB