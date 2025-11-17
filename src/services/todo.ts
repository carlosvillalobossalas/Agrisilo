import firestore from '@react-native-firebase/firestore'
import { ToDo } from '../interfaces/todos'

const todoCollection = firestore().collection('ToDo')


export const getAllToDos = (callback: (todo: ToDo[]) => void) => {

    const subscriber = todoCollection.onSnapshot((snapshot) => {
        const data: ToDo[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<ToDo, 'id'>
        }))
        callback(data.sort((a, b) => Number(a.completed) - Number(b.completed)))
    },
        (error) => {
            console.log(error)
        }
    )

    return subscriber

}

export const saveToDo = async (todo: ToDo) => {
    try {
        if (todo.id === '') {
            const { id, ...rest } = todo;
            await todoCollection.add(rest)
        } else {
            await todoCollection.doc(todo.id).set({
                ...todo
            })
        }
    } catch (error) {
        console.error(error)
    }
}

export const deleteToDo = async (id: string) => {
    try {
        await todoCollection.doc(id).delete()
    } catch (error) {
        console.error(error)
    }
}