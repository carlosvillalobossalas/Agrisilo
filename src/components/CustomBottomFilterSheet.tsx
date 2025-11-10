import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Portal, SegmentedButtons } from 'react-native-paper'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CustomDropdown from './CustomDropdown'

interface CustomBottomFilterSheet {
    ref: React.RefObject<BottomSheetModal | null>,
    handleSheetChanges: (index: number) => void
}


const CustomBottomFilterSheet = ({ ref, handleSheetChanges }: CustomBottomFilterSheet) => {
    const [status, setStatus] = useState('incompleted')
    const [openStatusDropdown, setOpenStatusDropdown] = useState(false)
    const [service, setService] = useState('siembra')
    const [openServiceDropdown, setOpenServiceDropdown] = useState(false)
    const [client, setClient] = useState('a')
    const [openClientDropdown, setOpenClientDropdown] = useState(false)
    const [colorFilter, setColorFilter] = useState('service')

    const insets = useSafeAreaInsets();

    return (
        <Portal>
            <BottomSheetModal
                ref={ref}
                index={1}
                snapPoints={['40%', '100%']}
                enablePanDownToClose={true}
                backgroundStyle={{
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                }}
                handleStyle={{
                    marginTop: insets.top,
                }}
                onChange={handleSheetChanges}
            >
                <BottomSheetView
                    style={{
                        flex: 1,
                        padding: 24,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: 'bold', zIndex: 0 }}>Filtros</Text>
                    <View style={{ marginTop: 20, width: '100%' }}>
                        <CustomDropdown
                            placeholder="Estado"
                            value={status}
                            setValue={setStatus}
                            setOpen={setOpenStatusDropdown}
                            open={openStatusDropdown}
                            items={[
                                { label: 'En proceso', value: 'incompleted' },
                                { label: 'Completado', value: 'completed' },
                                { label: 'Cancelado', value: 'cancelled' },
                            ]}
                        />
                        <View style={{ height: 20 }} />
                        <View style={{ zIndex: 2 }}>
                            <CustomDropdown
                                placeholder="Servicio"
                                value={service}
                                setValue={setService}
                                setOpen={setOpenServiceDropdown}
                                open={openServiceDropdown}
                                items={[
                                    { label: 'Siembra', value: 'siembra' },
                                    { label: 'Fumigación', value: 'fumigacion' },
                                    { label: 'Riego', value: 'riego' },
                                ]}
                            />
                        </View>
                        <View style={{ height: 20 }} />
                        <View style={{ zIndex: 1 }}>
                            <CustomDropdown
                                placeholder="Cliente"
                                value={client}
                                setValue={setClient}
                                setOpen={setOpenClientDropdown}
                                open={openClientDropdown}
                                items={[
                                    { label: 'Cliente A', value: 'a' },
                                    { label: 'Cliente B', value: 'b' },
                                    { label: 'Cliente C', value: 'c' },
                                ]}
                            />
                        </View>
                        <View style={{ height: 20 }} />
                        <Text style={{ fontSize: 16, fontWeight: 'bold', zIndex: 0, marginVertical: 10 }}>Colores por:</Text>
                        <SegmentedButtons
                            value={colorFilter}
                            onValueChange={setColorFilter}
                            buttons={[
                                { value: 'service', label: 'Servicio' },
                                { value: 'status', label: 'Estado' },
                                { value: 'client', label: 'Cliente' },
                            ]}
                            style={{
                                backgroundColor: '#e5e5e5',
                                borderRadius: 112,
                                marginBottom: 20
                            }}
                            theme={{
                                colors: {
                                    secondaryContainer: 'white',
                                },
                            }}
                        />
                    </View>

                </BottomSheetView>
            </BottomSheetModal>
        </Portal>
    )
}

export default CustomBottomFilterSheet