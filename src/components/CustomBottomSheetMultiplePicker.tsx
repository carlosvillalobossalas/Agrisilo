import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Icon, IconButton, Portal } from 'react-native-paper'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Item {
    label: string,
    value: string
}

interface CustomBottomSheetMultiplePicker {
    ref: React.RefObject<BottomSheetModal | null>,
    title: string,
    items: Item[],
    selectedValue: string[],
    onPress: (value: string) => void,
    onDismiss?: () => void,
}

const CustomBottomSheetMultiplePicker = ({ ref, title, items, selectedValue, onPress, onDismiss }: CustomBottomSheetMultiplePicker) => {

    const insets = useSafeAreaInsets();

    return (
        <Portal>
            <BottomSheetModal
                ref={ref}
                index={1}
                snapPoints={['60%', '100%']}
                onDismiss={() => {
                    if (typeof onDismiss === 'function') onDismiss()
                }}
                stackBehavior='replace'
                enablePanDownToClose={true}
                backgroundStyle={{
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                }}
                handleStyle={{
                    marginTop: insets.top,
                }}
            >
                <BottomSheetView
                    style={{
                        flex: 1,
                        paddingTop: 12,
                        paddingHorizontal: 5,
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10,
                            marginBottom: 15,
                        }}
                    >
                        {/* Botón invisible para balancear */}
                        <IconButton icon="close-circle-outline" size={28} style={{ opacity: 0 }} />

                        {/* Título centrado */}
                        <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                            {title}
                        </Text>

                        {/* Botón real */}
                        <IconButton icon="close-circle-outline" size={28} onPress={() => ref.current?.close()} />
                    </View>

                    {
                        items.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    width: '100%',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    padding: 16,
                                    borderBottomWidth: 1,
                                    borderColor: 'gray'
                                }}
                                onPress={() => { onPress(item.value) }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: selectedValue.includes(item.value) ? 'bold' : '500' }}>{item.label}</Text>

                                {
                                    selectedValue.includes(item.value) && <Icon source={'check'} size={26} color='green' />
                                }

                            </TouchableOpacity>
                        ))
                    }
                </BottomSheetView>
            </BottomSheetModal>
        </Portal>
    )
}

export default CustomBottomSheetMultiplePicker