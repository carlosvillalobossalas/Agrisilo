import { ICalendarEventBase } from "react-native-big-calendar"

export interface IEvent {
    id: string
    name: string
    services: string[]
    startDate: string
    endDate: string
    status: string
    client: string
}

export type CalendarEvent = ICalendarEventBase & { color?: string, id: string }