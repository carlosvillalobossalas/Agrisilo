import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Button, PaperProvider, SegmentedButtons, useTheme } from 'react-native-paper'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CustomDropdown from './CustomDropdown'
import { useAppSelector } from '../store'
import { useDispatch } from 'react-redux'
import { setClientFilter, setColorBy, setServiceFilter, setStatusFilter } from '../store/slices/eventSlice'

interface CustomBottomFilterSheet {
    ref: React.RefObject<BottomSheetModal | null>,
    handleSheetChanges: (index: number) => void
}


const CustomBottomFilterSheet = ({ ref, handleSheetChanges }: CustomBottomFilterSheet) => {
    const theme = useTheme()

    const eventState = useAppSelector(state => state.eventState)
    const clientState = useAppSelector(state => state.clientState)
    const serviceState = useAppSelector(state => state.serviceState)
    const statusState = useAppSelector(state => state.statusState)


    const dispatch = useDispatch()

    const [openStatusDropdown, setOpenStatusDropdown] = useState(false)
    const [openServiceDropdown, setOpenServiceDropdown] = useState(false)
    const [openClientDropdown, setOpenClientDropdown] = useState(false)

    const insets = useSafeAreaInsets();

    const handleColorByChange = (value: string) => {
        dispatch(setColorBy(value))
    }

    return (
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
            <PaperProvider theme={theme}>
                <BottomSheetView
                    style={{
                        flex: 1,
                        padding: 24,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: 'bold', zIndex: 0 }}>Filtros</Text>
                    <View style={{ marginTop: 20, width: '100%' }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Estado</Text>
                        <CustomDropdown
                            placeholder="Seleccionar estado"
                            value={eventState.config.statusFilter}
                            setValue={(next) => {

                                let newValue: string

                                if (typeof next === 'function') {
                                    newValue = next(eventState.config.statusFilter)
                                } else {
                                    newValue = next
                                }

                                dispatch(setStatusFilter(newValue))
                            }}
                            setOpen={setOpenStatusDropdown}
                            open={openStatusDropdown}
                            items={[
                                { label: 'Ninguno', value: 'none' },
                                ...statusState.statuses.map(status => {
                                    return { label: status.name, value: status.id }
                                }),
                            ]}
                        />
                        <View style={{ height: 20 }} />
                        <View style={{ zIndex: 2 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Servicio</Text>
                            <CustomDropdown
                                placeholder="Seleccionar servicio"
                                value={eventState.config.serviceFilter}
                                setValue={(next) => {

                                    let newValue: string

                                    if (typeof next === 'function') {
                                        newValue = next(eventState.config.serviceFilter)
                                    } else {
                                        newValue = next
                                    }

                                    dispatch(setServiceFilter(newValue))
                                }}
                                setOpen={setOpenServiceDropdown}
                                open={openServiceDropdown}
                                items={[
                                    { label: 'Ninguno', value: 'none' },
                                    ...serviceState.services.map(service => {
                                        return { label: service.name, value: service.id }
                                    }),
                                ]}
                            />
                        </View>
                        <View style={{ height: 20 }} />
                        <View style={{ zIndex: 1 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Cliente</Text>
                            <CustomDropdown
                                placeholder="Seleccionar cliente"
                                value={eventState.config.clientFilter}
                                setValue={(next) => {

                                    let newValue: string

                                    if (typeof next === 'function') {
                                        newValue = next(eventState.config.clientFilter)
                                    } else {
                                        newValue = next
                                    }

                                    dispatch(setClientFilter(newValue))
                                }}
                                setOpen={setOpenClientDropdown}
                                open={openClientDropdown}
                                items={[
                                    { label: 'Ninguno', value: 'none' },
                                    ...clientState.clients.map(client => {
                                        return { label: client.name, value: client.id }
                                    }),
                                ]}
                            />
                        </View>
                        <View style={{ height: 20 }} />

                        <Text style={{ fontSize: 16, fontWeight: 'bold', zIndex: 0, marginVertical: 10 }}>Colores por:</Text>
                        <SegmentedButtons
                            value={eventState.config.colorBy}
                            onValueChange={(value) => {
                                handleColorByChange(value)
                            }}
                            buttons={[
                                { value: 'service', label: 'Servicio' },
                                { value: 'status', label: 'Estado' },
                                { value: 'client', label: 'Cliente' },
                            ]}
                            style={{ marginBottom: 10 }}
                        />
                        <Button
                            mode='contained'
                            onPress={() => {
                                dispatch(setStatusFilter('none'))
                                dispatch(setServiceFilter('none'))
                                dispatch(setClientFilter('none'))
                            }}
                            style={{ marginTop: 10 }}
                        >
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>
                                Limpiar filtros
                            </Text>
                        </Button>
                    </View>

                </BottomSheetView>
            </PaperProvider>
        </BottomSheetModal >
    )
}

export default CustomBottomFilterSheet