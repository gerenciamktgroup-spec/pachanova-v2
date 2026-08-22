import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <span className="serif text-xl">PachaNova</span>
        <Link href="/login" className="text-sm border border-line rounded-full px-4 py-1.5 hover:bg-card">
          Entrar
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-16 pb-24">
        <p className="text-xs uppercase tracking-[0.2em] text-mute mb-4">Cofinanciamiento inmobiliario</p>
        <h1 className="text-4xl md:text-6xl leading-[1.1] max-w-3xl">
          Tierra y edificios, con reglas claras para cada rol.
        </h1>
        <p className="mt-6 max-w-xl text-mute text-lg leading-relaxed">
          El administrador opera el proyecto. El inversor aporta capital. El cliente compra o arrienda el inmueble.
          Cada movimiento queda registrado. No hay tokens.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/login" className="bg-clay text-white rounded-lg px-5 py-2.5 text-sm">
            Entrar a la plataforma
          </Link>
          <Link href="/como-funciona" className="border border-line rounded-lg px-5 py-2.5 text-sm">
            Cómo funciona
          </Link>
        </div>

        <section className="mt-20 grid md:grid-cols-3 gap-6">
          {[
            { t: "Administrador", d: "Crea proyectos de landbanking, venta o renta. Carga documentos, abre la ronda, concilia aportes y publica ofertas." },
            { t: "Inversor", d: "Ve la tesis, completa identidad y aporta capital. Sigue su participación y los hitos. No compra el depto desde este panel." },
            { t: "Cliente", d: "Reserva un lote, una unidad o un alquiler. Informa pagos. No ve el cap table de inversores." },
          ].map((x) => (
            <article key={x.t} className="border border-line rounded-2xl p-6 bg-card">
              <h2 className="text-xl mb-2">{x.t}</h2>
              <p className="text-sm text-mute leading-relaxed">{x.d}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
