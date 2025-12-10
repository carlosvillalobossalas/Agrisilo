import firestore from '@react-native-firebase/firestore';
import { IReminder } from '../interfaces/reminders';

const remindersCollection = firestore().collection('Reminders');

export const saveReminder = async (reminder: IReminder) => {
    try {
        if (reminder.id) {
            // Actualizar recordatorio existente
            await remindersCollection.doc(reminder.id).update({
                eventId: reminder.eventId || null,
                todoId: reminder.todoId || null,
                reminderDate: firestore.Timestamp.fromDate(new Date(reminder.reminderDate)),
                userIds: reminder.userIds,
                createdAt: firestore.Timestamp.fromDate(new Date(reminder.createdAt))
            });
        } else {
            // Crear nuevo recordatorio
            await remindersCollection.add({
                eventId: reminder.eventId || null,
                todoId: reminder.todoId || null,
                reminderDate: firestore.Timestamp.fromDate(new Date(reminder.reminderDate)),
                userIds: reminder.userIds,
                createdAt: firestore.FieldValue.serverTimestamp(),
                sent: false // Flag para saber si ya se envió la notificación
            });
        }
    } catch (error) {
        console.error('Error al guardar recordatorio:', error);
        throw error;
    }
};

export const deleteReminder = async (id: string) => {
    try {
        await remindersCollection.doc(id).delete();
    } catch (error) {
        console.error('Error al eliminar recordatorio:', error);
        throw error;
    }
};

export const getReminders = () => {
    return remindersCollection.orderBy('reminderDate', 'desc');
};

export const getRemindersByEvent = (eventId: string) => {
    return remindersCollection.where('eventId', '==', eventId).orderBy('reminderDate', 'asc');
};
