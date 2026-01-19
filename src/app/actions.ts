"use server";

import { z } from "zod";
import { addExpenseToSheet } from "@/lib/sheets";

const expenseSchema = z.object({
    date: z.string().min(1, "La fecha es requerida"),
    amount: z.coerce.number().positive("El monto debe ser positivo"),
    category: z.string().min(1, "Selecciona una categoría"),
    description: z.string().optional().default(""),
});

export type FormState = {
    message: string;
    success?: boolean;
    fields?: Record<string, string>;
    issues?: string[];
}

export async function submitExpense(prevState: FormState, formData: FormData): Promise<FormState> {
    const data = Object.fromEntries(formData);
    const parsed = expenseSchema.safeParse(data);

    if (!parsed.success) {
        const fields: Record<string, string> = {};
        for (const key of Object.keys(data)) {
            fields[key] = data[key].toString();
        }
        return {
            message: "Por favor revisa los campos.",
            success: false,
            fields,
            issues: parsed.error.issues.map((issue) => issue.message),
        };
    }

    try {
        const formattedDate = new Date(parsed.data.date).toLocaleDateString("es-ES");

        await addExpenseToSheet({
            ...parsed.data,
            date: formattedDate,
        });

        return { message: "Gasto registrado correctamente", success: true };
    } catch (error: any) {
        console.error("Error submitting expense:", error);
        return {
            message: `Error: ${error.message || "Error desconocido al conectar con Google Sheets"}`,
            success: false,
        };
    }
}
