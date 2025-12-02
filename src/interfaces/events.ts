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

export interface EventFilters {
    clients: string[];
    services: string[];
    statuses: string[];
    startDate: string;
    endDate: string;
}

export interface EventsPDFRow {
    client: string
    area:string
    location:string
    service: string
    status: string
    startDate: string
    endDate: string
    name: string
}

export type CalendarEvent = ICalendarEventBase & { color?: string, id: string }