import firestore from '@react-native-firebase/firestore'
import { Status } from '../interfaces/status';

const statusCollection = firestore().collection('Status')


export const getAllStatus = (callback: (status: Status[]) => void) => {

    const subscriber = statusCollection.onSnapshot((snapshot) => {
        const data: Status[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<Status, 'id'>
        }))
        callback(data)
    },
        (error) => {
            console.log(error)
        }
    )

    return subscriber

}

export const saveStatus = async (status: Status) => {
    try {
        if (status.id === '') {
            const { id, ...rest } = status;
            await statusCollection.add(rest)
        } else {
            await statusCollection.doc(status.id).set({
                ...status
            })
        }
    } catch (error) {
        console.error(error)
    }
}