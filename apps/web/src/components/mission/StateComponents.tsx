import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader2, AlertCircle, FileX } from "lucide-react";

export function LoadingState({ message = "Cargando..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-pn-text-muted">
      <Loader2 className="h-6 w-6 animate-spin mb-4" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function ErrorState({ title = "Error de carga", message, className }: { title?: string, message?: string, className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-pn-danger bg-pn-danger/5 rounded-xl border border-pn-danger/20", className)}>
      <AlertCircle className="h-6 w-6 mb-2" />
      <h3 className="font-semibold text-sm">{title}</h3>
      {message && <p className="text-xs mt-1 opacity-80">{message}</p>}
    </div>
  );
}

export function EmptyState({ title, description, icon, action, className }: { title: string, description?: string, icon?: ReactNode, action?: ReactNode, className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center border border-dashed border-pn-border rounded-xl", className)}>
      <div className="text-pn-text-soft mb-4">
        {icon || <FileX className="h-8 w-8" />}
      </div>
      <h3 className="text-sm font-medium text-pn-text">{title}</h3>
      {description && <p className="text-xs text-pn-text-muted mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function DataState<T>({ 
  data, 
  isLoading, 
  error, 
  renderData,
  emptyTitle = "Sin datos"
}: { 
  data: T[] | null | undefined, 
  isLoading: boolean, 
  error?: Error | null, 
  renderData: (data: T[]) => ReactNode,
  emptyTitle?: string
}) {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;
  if (!data || data.length === 0) return <EmptyState title={emptyTitle} />;
  return <>{renderData(data)}</>;
}
