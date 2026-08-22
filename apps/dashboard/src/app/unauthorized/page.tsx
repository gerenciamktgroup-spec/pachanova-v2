export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050608] text-white px-6">
      <h1 className="text-3xl font-light mb-3">Acceso denegado</h1>
      <p className="text-white/60 max-w-md text-center">
        Este apartado no corresponde a tu rol. El administrador opera proyectos,
        el inversor cofinancia, el cliente compra o arrienda.
      </p>
    </div>
  );
}
