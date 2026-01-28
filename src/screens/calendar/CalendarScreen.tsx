import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { Calendar, Mode, modeToNum } from 'react-native-big-calendar'
import { CalendarEvent } from '../../interfaces/events'
import { IconButton, SegmentedButtons, Text, useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { setEventByCalendarEvent } from '../../store/slices/eventSlice'
import { useAppSelector } from '../../store'
import { useDispatch } from 'react-redux'
import { TouchableOpacity, View } from 'react-native'
import CustomBottomEventDetails from '../../components/CustomBottomEventDetails'
import CustomBottomFilterSheet from '../../components/CustomBottomFilterSheet'
import CustomCalendarFAB from '../../components/CustomCalendarFAB'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { clearPendingNavigation } from '../../store/slices/notificationSlice'

const today = new Date()

const CustomEventCell = ({ event, touchableOpacityProps }: any) => {
  return (
    <TouchableOpacity {...touchableOpacityProps} key={event.id}>
      <View style={{ padding: 0, flex: 1 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 2
          }}
          numberOfLines={1}
        >
          {event.title}
        </Text>
        {event.children}
      </View>
    </TouchableOpacity>
  )
}

const CalendarScreen = () => {

  const theme = useTheme()
  const navigation = useNavigation()

  const eventState = useAppSelector(state => state.eventState)
  const serviceState = useAppSelector(state => state.serviceState)
  const statusState = useAppSelector(state => state.statusState)
  const clientState = useAppSelector(state => state.clientState)
  const notificationState = useAppSelector(state => state.notificationState)
  const dispatch = useDispatch()


  const [date, setDate] = useState(today)
  const [mode, setMode] = useState<Mode>('month')
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const eventBottomSheetRef = useRef<BottomSheetModal>(null);

  // Listener unificado para notificaciones (eventos y recordatorios)
  useEffect(() => {
    if (notificationState.pendingNavigation) {
      const { screen, params, type } = notificationState.pendingNavigation;
      if (type === 'event') {
        // Abrir bottom sheet de evento
        eventBottomSheetRef.current?.present();
      } else if (type === 'todo_reminder') {
        // Navegar a ReminderScreen
        (navigation as any).navigate(screen, params);
      }
      dispatch(clearPendingNavigation());
    }
  }, [notificationState.pendingNavigation, navigation, dispatch]);



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

  const events = useMemo<CalendarEvent[]>(
    () => {
      if (eventState.events.length === 0) return []

      let eventsTemp = [...eventState.events]

      if (eventState.config.statusFilter !== 'none') {
        eventsTemp = eventsTemp.filter(
          (event) => event.status === eventState.config.statusFilter
        )
      }

      if (eventState.config.serviceFilter !== 'none') {
        eventsTemp = eventsTemp.filter(
          (event) => event.services.includes(eventState.config.serviceFilter)
        )
      }

      if (eventState.config.clientFilter !== 'none') {
        eventsTemp = eventsTemp.filter(
          (event) => event.client === eventState.config.clientFilter
        )
      }

      return eventsTemp.map((event) => ({
        id: event.id,
        title: event.name,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
        hideHours: true,
        children:
          <View>
            {event?.client && mode !== 'month' ? <Text style={{ fontSize: 11, color: 'white' }}>{clientState.clients.find(client => client.id === event.client)?.name ?? ''}</Text> : null}
            {mode !== 'month' ? <Text style={{ fontSize: 11, color: 'white' }}>{new Date(event.startDate).toLocaleDateString('es-CR')} - {new Date(event.endDate).toLocaleDateString('es-CR')}</Text> : null}
          </View>,
        color:
          eventState.config.colorBy === 'service'
            ? (event.services.length > 0 ? serviceState.services.find(
              (service) => service.id === event.services[0]
            )?.color : 'white')
            : eventState.config.colorBy === 'status'
              ? statusState.statuses.find(
                (status) => status.id === event.status
              )?.color
              : clientState.clients.find(
                (client) => client.id === event.client
              )?.color,
      }))
    },
    [eventState, serviceState, statusState, clientState, mode]
  )

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
            borderRadius: 112,
          }}
        />
      </View>

      {/* Calendario */}
      <Calendar
        locale="es"
        events={events}
        date={date}
        height={700}
        mode={mode}
        eventCellStyle={(event) => ({
          backgroundColor: event.color,
          borderRadius: 6,
        })}
        renderEvent={(event, touchableOpacityProps) => (
          <CustomEventCell event={event} touchableOpacityProps={touchableOpacityProps} />
        )}
        onPressEvent={(pressEvent) => {
          setDate(pressEvent.start)
          if (mode === 'month') {
            setMode('day')
          } else {
            dispatch(setEventByCalendarEvent(pressEvent.id))
            eventBottomSheetRef.current?.present()
          }
        }}
        onPressCell={(pressDate) => {
          setDate(pressDate)
          setMode('day')
        }}
        theme={{
          palette: {
            primary: {
              main: theme.colors.primary,
            }
          }
        }}
        eventMinHeightForMonthView={20}
        maxVisibleEventCount={3}
        moreLabel={`+{moreCount} más`}
        showAdjacentMonths={false}
        onSwipeEnd={(date) => {
          setDate(date)
        }}
      />

      {/* Filtros */}
      <CustomBottomFilterSheet ref={bottomSheetRef} handleSheetChanges={handleSheetChanges} />

      {/* Detalles de evento */}
      <CustomBottomEventDetails ref={eventBottomSheetRef} />

      {/* FAB */}
      <CustomCalendarFAB />
    </SafeAreaView >
  );

}

export default CalendarScreen
