import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Configuración de credenciales de Service Account
const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});

export type ExpenseData = {
    date: string;
    category: string;
    amount: number;
    description: string;
};

export async function addExpenseToSheet(data: ExpenseData) {
    if (!process.env.GOOGLE_SHEET_ID) {
        throw new Error('GOOGLE_SHEET_ID no está definido en las variables de entorno');
    }

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);

    await doc.loadInfo(); // Carga las propiedades del documento y las hojas

    const sheet = doc.sheetsByIndex[0]; // Usamos la primera hoja por defecto

    // Aseguramos que los encabezados existan (opcional, pero buena práctica si la hoja es nueva)
    await sheet.setHeaderRow(['Fecha', 'Categoría', 'Monto', 'Descripción']);

    await sheet.addRow({
        'Fecha': data.date,
        'Categoría': data.category,
        'Monto': data.amount,
        'Descripción': data.description,
    });

    return true;
}

export async function getExpenses() {
    if (!process.env.GOOGLE_SHEET_ID) {
        return [];
    }

    try {
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();

        return rows.map((row) => ({
            date: row.get('Fecha'),
            category: row.get('Categoría'),
            amount: parseFloat(row.get('Monto')) || 0,
            description: row.get('Descripción'),
        }));
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return [];
    }
}
