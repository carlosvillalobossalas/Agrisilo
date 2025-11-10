import React, { useCallback, useRef, useState } from 'react'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { Calendar, ICalendarEventBase, Mode, modeToNum } from 'react-native-big-calendar'
import { FAB, IconButton, Portal, SegmentedButtons, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View } from 'react-native'
import dayjs from 'dayjs'
import CustomBottomFilterSheet from '../../components/CustomBottomFilterSheet'
import CustomCalendarFAB from '../../components/CustomCalendarFAB'

const events: Array<ICalendarEventBase & { color?: string }> = [
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
  {
    title: 'Riego zona norte',
    start: new Date(2025, 10, 4, 9, 0),
    end: new Date(2025, 10, 4, 12, 0),
    color: '#2e7d32',
  },
  {
    title: 'Riego zona norte',
    start: new Date(2025, 10, 4, 9, 0),
    end: new Date(2025, 10, 4, 12, 0),
    color: '#2e7d32',
  },
  {
    title: 'Riego zona norte',
    start: new Date(2025, 10, 4, 9, 0),
    end: new Date(2025, 10, 4, 12, 0),
    color: '#2e7d32',
  },
];

const today = new Date()


const CalendarScreen = () => {
  const [date, setDate] = useState(today)
  const [mode, setMode] = useState<Mode>('month')
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const bottomSheetRef = useRef<BottomSheetModal>(null);


  const handleSheetChanges = useCallback((index: number) => {
    // index === -1 significa que está cerrado
    setIsSheetOpen(index !== -1);
  }, []);

  const handleToggleModal = useCallback(() => {
    if (isSheetOpen) {
      bottomSheetRef.current?.dismiss(); // 👈 cierra si está abierto
    } else {
      bottomSheetRef.current?.present();  // 👈 abre si está cerrado
    }
  }, [isSheetOpen]);

  const _onPrevDate = () => {
    if (mode === 'month') {
      setDate(dayjs(date)
        .add(dayjs(date).date() * -1, 'day')
        .toDate(),)
    } else {
      //TODO: fix next/prev 
      if (mode !== 'schedule')
        setDate(
          dayjs(date)
            .add(modeToNum(mode, date) * -1, 'day')
            .toDate(),
        )
    }
  }

  const _onNextDate = () => {
    if (mode !== 'schedule')
      setDate(dayjs(date).add(modeToNum(mode, date), 'day').toDate())
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header con navegación */}
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          position: 'relative',
        }}
      >
        <IconButton icon={'chevron-left'} size={30} onPress={_onPrevDate} />
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          {dayjs(date)
            .format('MMMM YYYY')
            .replace(/^./, (c) => c.toUpperCase())}
        </Text>
        <IconButton icon={'chevron-right'} size={30} onPress={_onNextDate} />
        <IconButton
          style={{
            right: 5,
            position: 'absolute',
            top: 5,
          }}
          icon={'calendar-filter'}
          onPress={handleToggleModal}
        />
      </View>

      {/* Toggle superior */}
      <View style={{ marginHorizontal: 15, marginTop: 10, marginBottom: 20 }}>
        <SegmentedButtons
          value={mode}
          onValueChange={setMode}
          buttons={[
            { value: 'month', label: 'Mes' },
            { value: 'week', label: 'Semana' },
            { value: 'day', label: 'Día' },
            { value: 'schedule', label: 'Agenda' },
          ]}
          style={{
            backgroundColor: '#e5e5e5',
            borderRadius: 112,
          }}
          theme={{
            colors: {
              secondaryContainer: 'white',
            },
          }}
        />
      </View>

      {/* Calendario */}
      <Calendar
        locale="es"
        events={events}
        date={date}
        height={600}
        mode={mode}
        eventCellStyle={(event) => ({
          backgroundColor: event.color,
          borderRadius: 6,
        })}
        eventMinHeightForMonthView={20}
        maxVisibleEventCount={2}
        moreLabel={`+{moreCount} más`}
        showAdjacentMonths={false}
        swipeEnabled
      />

      {/* Filtros */}
      <CustomBottomFilterSheet ref={bottomSheetRef} handleSheetChanges={handleSheetChanges} />

      {/* FAB */}
      <CustomCalendarFAB />
    </SafeAreaView >
  );

}

export default CalendarScreen
