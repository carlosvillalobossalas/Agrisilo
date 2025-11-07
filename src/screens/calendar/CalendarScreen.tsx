import { View } from 'react-native'
import React, { useState } from 'react'
import { Calendar, Mode } from 'react-native-big-calendar'
import { SegmentedButtons } from 'react-native-paper'
import DropDownPicker from 'react-native-dropdown-picker'

const events = [
  {
    title: 'Siembra de arroz',
    start: new Date(2025, 10, 2, 9, 0),
    end: new Date(2025, 10, 2, 11, 0),
    color: '#a67c52',
  },
  {
    title: 'Fumigación finca A',
    start: new Date(2025, 10, 4, 13, 0),
    end: new Date(2025, 10, 4, 15, 0),
    color: '#c62828',
  },
  {
    title: 'Riego zona norte',
    start: new Date(2025, 10, 4, 9, 0),
    end: new Date(2025, 10, 4, 12, 0),
    color: '#2e7d32',
  },
];

const CalendarScreen = () => {
  const [mode, setMode] = useState<Mode>('month')
  const [status, setStatus] = useState('incompleted')
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false)
  const [service, setService] = useState('siembra')
  const [openServiceDropdown, setOpenServiceDropdown] = useState(false)
  const [client, setClient] = useState('a')
  const [openClientDropdown, setOpenClientDropdown] = useState(false)

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Toggle superior */}
      <View style={{ margin: 15 }}>
        <SegmentedButtons
          value={mode}
          onValueChange={setMode}
          buttons={[
            { value: 'month', label: 'Mes' },
            { value: 'week', label: 'Semana' },
            { value: 'day', label: 'Día' },
            { value: 'schedule', label: 'Agenda' },
          ]}
        />
      </View>

      {/* Dropdowns alineados */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          // marginTop: 5,
          marginHorizontal: 10,
          marginBottom: 20,
          zIndex: 3000,
        }}
      >
        {/* Estado */}
        <View style={{ flex: 1, marginRight: 5, zIndex: 3000 }}>
          <DropDownPicker
            open={openStatusDropdown}
            value={status}

            items={[
              { label: 'En proceso', value: 'incompleted' },
              { label: 'Completado', value: 'completed' },
              { label: 'Cancelado', value: 'cancelled' },
            ]}
            setOpen={setOpenStatusDropdown}
            setValue={setStatus}
            placeholder="Estado"
            style={{
              borderColor: 'transparent',
              borderRadius: 20,
              backgroundColor: '#f0f0f0',
              minHeight: 40,
            }}
            dropDownContainerStyle={{
              borderColor: '#ddd',
            }}
          />
        </View>

        {/* Servicio */}
        <View style={{ flex: 1, marginHorizontal: 5, zIndex: 2000 }}>
          <DropDownPicker
            open={openServiceDropdown}
            value={service}
            items={[
              { label: 'Siembra', value: 'siembra' },
              { label: 'Fumigación', value: 'fumigacion' },
              { label: 'Riego', value: 'riego' },
            ]}
            setOpen={setOpenServiceDropdown}
            setValue={setService}
            placeholder="Servicio"
             style={{
              borderColor: 'transparent',
              borderRadius: 20,
              backgroundColor: '#f0f0f0',
              minHeight: 40,
            }}
            dropDownContainerStyle={{
              borderColor: '#ddd',
            }}
          />
        </View>

        {/* Cliente */}
        <View style={{ flex: 1, marginLeft: 5, zIndex: 1000 }}>
          <DropDownPicker
            open={openClientDropdown}
            value={client}
            items={[
              { label: 'Cliente A', value: 'a' },
              { label: 'Cliente B', value: 'b' },
              { label: 'Cliente C', value: 'c' },
            ]}
            setOpen={setOpenClientDropdown}
            setValue={setClient}
            placeholder="Cliente"
            style={{
              borderColor: 'transparent',
              borderRadius: 20,
              backgroundColor: '#f0f0f0',
              minHeight: 40,
            }}
            dropDownContainerStyle={{
              borderColor: '#ddd',
            }}
          />
        </View>
      </View>

      {/* Calendario */}
      <Calendar
        locale="es"
        events={events}
        height={600}
        mode={mode}
        eventCellStyle={(event) => ({
          backgroundColor: event.color,
          borderRadius: 6,
        })}
        swipeEnabled
      />
    </View>
  )
}

export default CalendarScreen
