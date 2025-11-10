import React, { useState } from 'react'
import { FAB, Portal } from 'react-native-paper'

const CustomCalendarFAB = () => {
    const [openFAB, setOpenFAB] = useState(false)
    const onFABStateChange = ({ open }: any) => setOpenFAB(open);
    return (
        <Portal >
            <FAB.Group
                icon={openFAB ? 'calendar-today' : 'plus'}
                style={{ position: 'absolute', bottom: 40, right: 5 }}
                visible
                open={openFAB}
                actions={[
                    {
                        label: 'Agregar tarea', icon: 'calendar-plus', onPress: () => { }
                    },
                    {
                        label: 'Agregar cliente', icon: 'account-group-outline', onPress: () => { }
                    },
                    {
                        label: 'Agregar servicio', icon: 'account-wrench-outline', onPress: () => { }
                    },
                    {
                        label: 'Agregar estado', icon: 'check', onPress: () => { }
                    },
                    {
                        label: 'Exportar PDF', icon: 'file-pdf-box', onPress: () => { }
                    }
                ]}
                onStateChange={onFABStateChange}
            />
        </Portal>
    )
}

export default CustomCalendarFAB