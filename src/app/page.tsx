import { ExpenseForm } from "@/components/expense-form";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-background to-background">
      <div className="w-full max-w-5xl mx-auto grid place-items-center min-h-[60vh]">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <ExpenseForm />

        <div className="mt-8">
          <Link href="/dashboard" className="text-sm font-medium text-muted hover:text-white transition-colors underline decoration-white/20 underline-offset-4 hover:decoration-white">
            Ver Dashboard y Estadísticas &rarr;
          </Link>
        </div>

        <footer className="mt-12 text-center text-xs text-muted">
          <p>Control de Gastos &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}
