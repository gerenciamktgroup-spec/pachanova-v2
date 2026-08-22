import Link from "next/link";

export default function ComoFunciona() {
  const steps = [
    ["1", "Se arma el proyecto", "Tipo, ubicación, tesis, meta de capital y data room."],
    ["2", "El inversor aporta", "Identidad verificada y capital a una ronda abierta."],
    ["3", "Se opera con trazabilidad", "Hitos, conciliación y registro de cada acción."],
    ["4", "El cliente compra o arrienda", "Ofertas de lotes, unidades o renta, aparte del inversor."],
  ];
  return (
    <div className="min-h-screen max-w-3xl mx-auto px-6 py-12">
      <Link href="/" className="text-sm text-mute">← PachaNova</Link>
      <h1 className="text-4xl mt-8 mb-10">Cómo funciona</h1>
      <ol className="space-y-8">
        {steps.map(([n, t, d]) => (
          <li key={n} className="grid grid-cols-[2rem_1fr] gap-4">
            <span className="text-mute">{n}</span>
            <div>
              <h2 className="text-xl">{t}</h2>
              <p className="text-mute mt-1">{d}</p>
            </div>
          </li>
        ))}
      </ol>
      <Link href="/login" className="inline-block mt-12 bg-clay text-white rounded-lg px-5 py-2.5 text-sm">Entrar</Link>
    </div>
  );
}
