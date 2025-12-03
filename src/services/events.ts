import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { EventFilters, EventsPDFRow, IEvent } from '../interfaces/events'
import { generatePDF } from 'react-native-html-to-pdf';


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


export const getFilteredEvents = async (filters: EventFilters): Promise<IEvent[]> => {
    const { clients, services, statuses, startDate, endDate } = filters;

    let query: FirebaseFirestoreTypes.Query = firestore()
        .collection("Events");

    // ---------------------------
    // 🔵 PRIMER FILTRO (Firestorm)
    // ---------------------------
    if (statuses.length > 0) {
        query = query.where("status", "in", statuses);
    }

    // ---------------------------
    // 🔵 TRAEMOS LOS DOCUMENTOS
    // ---------------------------
    const snapshot = await query.get();

    // ---------------------------
    // 🔵 MAPEO INICIAL
    // ---------------------------
    let data: IEvent[] = snapshot.docs.map(doc => {
        const raw = doc.data();
        return {
            id: doc.id,
            name: raw.name,
            services: raw.services,
            status: raw.status,
            client: raw.client,
            startDate: raw.startDate.toDate().toISOString(),
            endDate: raw.endDate.toDate().toISOString(),
        };
    });

    // ---------------------------
    // 🔵 FILTRO POR CLIENTES
    // ---------------------------
    if (clients.length > 0) {
        data = data.filter(ev => clients.includes(ev.client));
    }

    // ---------------------------
    // 🔵 FILTRO POR SERVICIOS
    // ---------------------------
    if (services.length > 0) {
        data = data.filter(ev =>
            ev.services.some(srv => services.includes(srv))
        );
    }

    // ---------------------------
    // 🔵 FILTRO POR RANGO DE FECHAS
    // ---------------------------
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    data = data.filter(ev => {
        const eventStart = new Date(ev.startDate).getTime();
        return eventStart >= start && eventStart <= end;
    });

    return data;
};

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

export const getEventById = async (id: string): Promise<IEvent | null> => {
    try {
        if (!id) return null;
        const doc = await eventCollection.doc(id).get();
        if (!doc.exists) return null;
        const raw = doc.data() as any;
        return {
            id: doc.id,
            name: raw.name,
            services: raw.services ?? [],
            status: raw.status ?? '',
            client: raw.client ?? '',
            startDate: raw.startDate?.toDate?.() ? raw.startDate.toDate().toISOString() : new Date(raw.startDate).toISOString(),
            endDate: raw.endDate?.toDate?.() ? raw.endDate.toDate().toISOString() : new Date(raw.endDate).toISOString(),
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const exportTablePDF = async (rows: EventsPDFRow[]) => {
    const html = `
    <html>
      <head>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }
          th, td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
          }
          th {
            background: #EEE;
          }
        </style>
      </head>
      <body>
        <h2 style="text-align:center;">Reporte de Eventos</h2>

        <table>
          <tr>
            <th>Tarea</th>
            <th>Cliente</th>
            <th>Área</th>
            <th>Ubicación</th>
            <th>Servicio</th>
            <th>Estado</th>
            <th>Fecha de inicio</th>
            <th>Fecha de fin</th>
          </tr>
          ${rows
            .map(
                row => `
              <tr>
                <td>${row.name}</td>
                <td>${row.client}</td>
                <td>${row.area}</td>
                <td>${row.location}</td>
                <td>${row.service}</td>
                <td>${row.status}</td>
                <td>${row.startDate}</td>
                <td>${row.endDate}</td>
              </tr>`
            )
            .join("")}
        </table>
      </body>
    </html>
  `;

    const file = await generatePDF({
        html,
        fileName: 'reporte_eventos',
        base64: false,
    });


    return file.filePath;
};