import firestore from '@react-native-firebase/firestore'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "@react-native-firebase/auth"
import { User } from "../interfaces/auth";
import { Alert, Linking } from 'react-native';

const auth = getAuth();
const userCollection = firestore().collection('Users')
const invitesCollection = firestore().collection('Invites')


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

export const signUp = async (email: string, password: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await saveUser({
        id: '',
        email,
        name,
        status: 'active'
    })

    return user.toJSON();
};

export const saveUser = async (user: User) => {
    try {
        if (user.id === '') {
            const { id, ...rest } = user;
            await userCollection.add(rest)
        } else {
            await userCollection.doc(user.id).set({
                ...user
            })
        }
    } catch (error) {
        console.error(error)
    }
}

export const getAllUsers = (callback: (user: User[]) => void) => {

    const subscriber = userCollection.onSnapshot((snapshot) => {
        const data: User[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<User, 'id'>
        }))
        callback(data)
    },
        (error) => {
            console.log(error)
        }
    )

    return subscriber
}

const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export const createInvite = async (email: string) => {
    const code = generateCode()

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // expira en 1 hora

    await invitesCollection.doc(code).set({
        code,
        email: email || null,
        used: false,
        createdAt: firestore.FieldValue.serverTimestamp(),
        expiresAt: firestore.Timestamp.fromDate(expiresAt),
    })

    return code;
}

export const validateInviteCode = async (code: string) => {
    const doc = await invitesCollection.doc(code).get();
    // console.log(ref)
    // const doc = await ref.get();
    console.log(doc)
    if (!doc.exists) {
        return { valid: false, reason: "Código inválido." };
    }

    const data = doc.data();
    const now = new Date();

    if (data!.used) {
        return { valid: false, reason: "Este código ya fue usado." };
    }

    if (data!.expiresAt.toDate() < now) {
        return { valid: false, reason: "Este código ha expirado." };
    }

    return { valid: true, data };
};

export const markInviteAsUsed = async (code: string) => {

    await invitesCollection.doc(code).update({
        used: true,
        usedAt: firestore.FieldValue.serverTimestamp(),
    });
};


export const sendInviteEmail = async (email: string, code: string) => {
    const subject = encodeURIComponent("Invitación para registrarte en Agrisilo");
    const body = encodeURIComponent(
        `Hola,

Has sido invitado a unirte a Agrisilo.

Tu código de verificación es:

📌 ${code}

Este código expira en 1 hora.

Ingresa a la app, selecciona "Crear cuenta" e introduce este código. \n

Saludos,
Equipo Agrisilo`
    );

    const mailUrl = `mailto:${email}?subject=${subject}&body=${body}`;

    const canOpen = await Linking.canOpenURL(mailUrl);

    if (!canOpen) {
        Alert.alert(
            "No se pudo abrir el correo",
            "Asegúrate de tener una aplicación de correo instalada."
        );
        return;
    }

    Linking.openURL(mailUrl);
};