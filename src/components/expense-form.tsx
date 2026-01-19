"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, CreditCard, Tag, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { submitExpense } from "@/app/actions";
import { cn } from "@/lib/utils";

const schema = z.object({
    date: z.string().min(1, "La fecha es requerida"),
    amount: z.string().min(1, "El monto es requerido").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "El monto debe ser positivo"),
    category: z.string().min(1, "Selecciona una categoría"),
    description: z.string().optional(),
});

type ExpenseInputs = z.infer<typeof schema>;

const categories = [
    "Alimentación",
    "Transporte",
    "Vivienda",
    "Ocio",
    "Salud",
    "Educación",
    "Ropa",
    "Ahorro",
    "Otros",
];

export function ExpenseForm() {
    const [isPending, setIsPending] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ExpenseInputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            date: "",
            amount: "",
            category: "",
            description: "",
        },
    });

    useEffect(() => {
        // Set default date client-side to avoid hydration mismatch
        const today = new Date().toISOString().split("T")[0];
        setValue("date", today);
    }, [setValue]);

    const onSubmit = async (data: ExpenseInputs) => {
        setIsPending(true);
        const formData = new FormData();
        formData.append("date", data.date);
        formData.append("amount", data.amount.toString());
        formData.append("category", data.category);
        formData.append("description", data.description || "");

        const result = await submitExpense({ message: "" }, formData);
        setIsPending(false);

        if (result.success) {
            toast.success("Gasto registrado correctamente");
            reset({
                date: new Date().toISOString().split("T")[0],
                amount: "",
                category: "",
                description: ""
            });
        } else {
            toast.error(result.message || "Error al registrar el gasto");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto"
        >
            <div className="glass rounded-2xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            Registrar Gasto
                        </h2>
                        <p className="text-muted text-sm">Controla tus finanzas diarias</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Amount Input - Premium Big Input */}
                        <div className="relative group/input">
                            <label className="text-xs font-medium text-muted mb-1.5 block ml-1">Monto</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className={cn(
                                        "glass-input w-full pl-9 pr-4 py-4 text-2xl font-bold rounded-xl",
                                        errors.amount && "border-red-500/50 focus:border-red-500"
                                    )}
                                    {...register("amount")}
                                />
                            </div>
                            {errors.amount && <p className="text-red-400 text-xs mt-1 ml-1">{errors.amount.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Date Input */}
                            <div className="relative">
                                <label className="text-xs font-medium text-muted mb-1.5 block ml-1">Fecha</label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="date"
                                        className={cn(
                                            "glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm",
                                            errors.date && "border-red-500/50"
                                        )}
                                        {...register("date")}
                                    />
                                </div>
                                {errors.date && <p className="text-red-400 text-xs mt-1 ml-1">{errors.date.message}</p>}
                            </div>

                            {/* Category Select */}
                            <div className="relative">
                                <label className="text-xs font-medium text-muted mb-1.5 block ml-1">Categoría</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <select
                                        className={cn(
                                            "glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm appearance-none cursor-pointer",
                                            errors.category && "border-red-500/50"
                                        )}
                                        {...register("category")}
                                    >
                                        <option value="" disabled>Seleccionar</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat} className="bg-zinc-900 text-white">
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.category && <p className="text-red-400 text-xs mt-1 ml-1">{errors.category.message}</p>}
                            </div>
                        </div>

                        {/* Description Input */}
                        <div className="relative">
                            <label className="text-xs font-medium text-muted mb-1.5 block ml-1">Descripción (Opcional)</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <textarea
                                    rows={2}
                                    placeholder="Detalles del gasto..."
                                    className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm resize-none"
                                    {...register("description")}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:pointer-events-none mt-2"
                        >
                            {isPending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Guardar Gasto</span>
                                    <CheckCircle2 className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}
