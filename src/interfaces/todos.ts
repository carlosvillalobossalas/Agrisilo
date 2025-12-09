export interface ToDo{
    id: string
    description: string
    userId: string
    completed: boolean
    assignedUserId?: string // Usuario asignado como responsable
}