export interface IReminder {
    id: string
    eventId?: string // Opcional ahora
    todoId?: string // Nuevo campo para todos
    reminderDate: string
    userIds: string[]
    createdAt: string
    sent?: boolean
}
