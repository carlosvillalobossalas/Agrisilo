import firestore from '@react-native-firebase/firestore'
import { IEvent } from '../interfaces/events'

const eventCollection = firestore().collection('Events')


export const getAllEvents = (callback: (event: IEvent[]) => void) => {

    const subscriber = eventCollection.onSnapshot((snapshot) => {
        const data: IEvent[] = snapshot.docs.map((doc) => {
            const raw = doc.data()
            return {
                id: doc.id,
                name: raw.name,
                services: raw.services,
                status: raw.status,
                client: raw.client,
                startDate: raw.startDate.toDate().toISOString(),
                endDate: raw.endDate.toDate().toISOString(),
            }
        })
        callback(data)
    },
        (error) => {
            console.log(error)
        }
    )

    return subscriber

}

export const saveEvent = async (event: IEvent) => {
    try {
        const { id, ...rest } = event;
        if (id === '') {
            await eventCollection.add({
                ...rest,
                startDate: firestore.Timestamp.fromDate(new Date(rest.startDate)),
                endDate: firestore.Timestamp.fromDate(new Date(rest.endDate)),
            })
        } else {
            await eventCollection.doc(id).set({
                ...rest,
                startDate: firestore.Timestamp.fromDate(new Date(rest.startDate)),
                endDate: firestore.Timestamp.fromDate(new Date(rest.endDate)),
            })
        }
    } catch (error) {
        console.error(error)
    }
}

export const deleteEvent = async (id: string) => {
    try {
        await eventCollection.doc(id).delete()
    } catch (error) {
        console.error(error)
    }
}