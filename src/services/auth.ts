import { getAuth, signInWithEmailAndPassword } from "@react-native-firebase/auth"

const auth = getAuth();

export const signIn = async (email: string, password: string) => {
    try {
        console.log('iniciando sesion')
        
        const res = await signInWithEmailAndPassword(auth, email, password);
        console.log(res.user)
    } catch (error) {
        console.log(error)
    }
}