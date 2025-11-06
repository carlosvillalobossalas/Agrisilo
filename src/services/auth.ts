import { getAuth, signInWithEmailAndPassword, signOut } from "@react-native-firebase/auth"

const auth = getAuth();

export const signIn = async (email: string, password: string) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        return res.user.toJSON();
    } catch (error) {
        console.error(error)
    }
}

export const logoutFB = async () => {
    try {
        await signOut(auth);
        return true
    } catch (error) {
        console.error(error)
        return false
    }

}