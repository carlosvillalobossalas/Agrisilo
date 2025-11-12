import { View } from 'react-native'
import React from 'react'
import { useAppSelector } from '../../store'
import CustomButtonWithIconRight from '../../components/CustomButtonWithIconRight'
import ColorPicker, { Preview } from 'reanimated-color-picker'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { setStatus } from '../../store/slices/statusSlice'

const StatusesScreen = () => {
    const statusState = useAppSelector(state => state.statusState)
    const dispatch = useDispatch()

    const navigation = useNavigation()
    return (
        <View style={{ flex: 1, gap: 10, paddingVertical: 20, paddingHorizontal: 25 }}>
            {
                statusState.statuses.map((status) => (
                    <CustomButtonWithIconRight
                        key={status.id}
                        mode='elevated'
                        label={status.name}
                        onPress={() => {
                            dispatch(setStatus(status))
                            navigation.navigate('StatusScreen')
                        }}
                        icon='chevron-right'
                        labelStyle={{ fontWeight: 'bold' }}
                    >
                        <ColorPicker
                            value={status.color}
                        >
                            <Preview style={{ width: 100, height: 15 }} hideInitialColor hideText />
                        </ColorPicker>
                    </CustomButtonWithIconRight>
                ))
            }
        </View >
    )
}

export default StatusesScreen