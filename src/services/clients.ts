import firestore from '@react-native-firebase/firestore'
import { Client } from '../interfaces/client'

const clientCollection = firestore().collection('Clients')


export const getAllClients = (callback: (client: Client[]) => void) => {

    const subscriber = clientCollection.onSnapshot((snapshot) => {
        const data: Client[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<Client, 'id'>
        }))
        callback(data)
    },
        (error) => {
            console.log(error)
        }
    )

    return subscriber

}

export const saveClient = async (client: Client) => {
    try {
        const { id, ...rest } = client;
        if (id === '') {
            await clientCollection.add(rest)
        } else {
            await clientCollection.doc(id).set({
                ...rest
            })
        }
    } catch (error) {
        console.error(error)
    }
}

export const deleteClient = async (id: string) => {
    try {
        await clientCollection.doc(id).delete()
    } catch (error) {
        console.error(error)
    }
}