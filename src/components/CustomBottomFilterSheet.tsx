import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Portal, SegmentedButtons } from 'react-native-paper'
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
        console.log(value)
        dispatch(setColorBy(value))
        // TODO: close modal?
        // handleSheetChanges(1)
    }

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
                                { label: 'Niguno', value: 'none' },
                                ...statusState.statuses.map(status => {
                                    return { label: status.name, value: status.id }
                                }),
                            ]}
                        />
                        <View style={{ height: 20 }} />
                        <View style={{ zIndex: 2 }}>
                            <CustomDropdown
                                placeholder="Servicio"
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
                            <CustomDropdown
                                placeholder="Cliente"
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