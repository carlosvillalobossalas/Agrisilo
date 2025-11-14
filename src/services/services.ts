import firestore from '@react-native-firebase/firestore'
import { Service } from '../interfaces/services'

const serviceCollection = firestore().collection('Services')


export const getAllServices = (callback: (service: Service[]) => void) => {

    const subscriber = serviceCollection.onSnapshot((snapshot) => {
        const data: Service[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<Service, 'id'>
        }))
        callback(data)
    },
        (error) => {
            console.log(error)
        }
    )

    return subscriber

}

export const saveService = async (service: Service) => {
    try {
        const { id, ...rest } = service;
        if (id === '') {
            await serviceCollection.add(rest)
        } else {
            await serviceCollection.doc(id).set({
                ...rest
            })
        }
    } catch (error) {
        console.error(error)
    }
}

export const deleteService = async (id: string) => {
    try {
        await serviceCollection.doc(id).delete()
    } catch (error) {
        console.error(error)
    }
}