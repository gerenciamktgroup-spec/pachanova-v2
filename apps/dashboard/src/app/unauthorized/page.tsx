export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-red-900 text-white">
      <h1 className="text-4xl font-bold">ACCESO DENEGADO</h1>
      <p className="ml-4">No tienes permisos de administrador para ver este panel.</p>
    </div>
  )
}
