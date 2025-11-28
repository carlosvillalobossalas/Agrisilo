import firestore from '@react-native-firebase/firestore'
import { createUserWithEmailAndPassword, EmailAuthProvider, getAuth, signInWithEmailAndPassword, signOut } from "@react-native-firebase/auth"
import { User } from "../interfaces/auth";
import { Alert, Linking } from 'react-native';

const auth = getAuth();
const userCollection = firestore().collection('Users')
const invitesCollection = firestore().collection('Invites')


export const signIn = async (email: string, password: string) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const userFS = await getUser(res.user.uid)
        //TODO: improve
        if (userFS?.status !== 'active') return { user: null, userFS: null };

        return { user: res.user.toJSON(), userFS };
    } catch (error) {
        console.error(error)
    }
}

export const getUser = async (uid: string) => {
    try {
        const userFS = await userCollection.doc(uid).get();

        const data = userFS.data();

        if (!data) return null;

        if (data.status !== 'active') return null;

        return { id: uid, ...userFS.data() as Omit<User, 'id'> }


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

    await user.updateProfile({
        displayName: name
    });

    await saveUser({
        id: user.uid,
        email,
        name,
        status: 'active',
        newPassword: '',
        admin: false,
    })

    return user.toJSON();
};

export const saveUser = async (user: User & { newPassword: string, currentPassword?: string }) => {

    try {
        const { id, newPassword, currentPassword, ...rest } = user;
        const currentUser = auth.currentUser

        if (!currentUser) throw new Error("Usuario no autenticado");

        if (newPassword && currentPassword) {
            const credential = EmailAuthProvider.credential(
                currentUser.email!,
                currentPassword
            );

            await currentUser.reauthenticateWithCredential(credential);
        }

        if (user.name !== currentUser?.displayName) {
            await currentUser?.updateProfile({
                displayName: user.name,
            });
        }

        if (newPassword !== '') {
            await currentUser?.updatePassword(newPassword);
        }

        await currentUser?.reload();

        await userCollection.doc(id).set({
            ...rest
        })
    } catch (error) {
        console.error(error)
    }

}

export const saveUserFCMToken = async (uid: string, token: string) => {
    try {
        await userCollection.doc(uid).update({
            fcmToken: token
        });
    } catch (error) {
        console.error(error)
    }
}

export const updateUser = async (user: User) => {
    try {
        await userCollection.doc(user.id).set({
            ...user
        })
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

    const rawBody =
        "Hola,\r\n\r\n" +
        "Has sido invitado a unirte a Agrisilo.\r\n\r\n" +
        "Tu código de verificación es:\r\n\r\n" +
        `📌 ${code}\r\n\r\n` +
        "Este código expira en 1 hora.\r\n\r\n" +
        "Ingresa a la app, selecciona \"Crear cuenta\" e introduce este código.\r\n\r\n" +
        "Saludos,\r\n" +
        "Equipo Agrisilo";

    const body = encodeURIComponent(rawBody);

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

export const sendPasswordResetEmail = async (email: string) => {
    try {
        await auth.sendPasswordResetEmail(email);
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}