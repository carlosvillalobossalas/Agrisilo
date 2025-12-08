export interface IReminder {
    id: string
    eventId: string
    reminderDate: string
    userIds: string[]
    createdAt: string
    sent?: boolean
}
