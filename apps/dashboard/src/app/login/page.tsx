import { login } from './actions'
import { AdminDemoLogin } from './AdminDemoLogin'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const errorMsg = resolvedSearchParams?.message as string | undefined;

  return (
    <div className="min-h-screen bg-pn-bg text-pn-text flex flex-col justify-center items-center relative overflow-hidden font-sans">
      {/* Background gradients and grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-pn-gold/20 opacity-20 blur-[100px]"></div>
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 -z-10 h-[400px] w-[600px] rounded-full bg-cyan-900/20 opacity-20 blur-[120px]"></div>
      </div>

      <div className="z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl tracking-tighter text-white font-light flex items-center justify-center gap-2">
              Pacha<span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pn-gold to-pn-sand">Nova</span>
            </h1>
          </Link>
          <p className="text-sm text-pn-text-muted mt-2 tracking-widest uppercase">
            Cofinanciamiento inmobiliario
          </p>
        </div>

        <div className="backdrop-blur-xl bg-pn-surface/40 border border-pn-border rounded-2xl shadow-2xl p-8 relative">
          <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-pn-gold/50 to-transparent"></div>
          
          <h2 className="text-xl font-medium text-white mb-6">Iniciar Sesión</h2>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-950/50 border border-red-900/50 rounded-lg text-sm text-red-200">
              {errorMsg}
            </div>
          )}

          <form action={login} className="flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-pn-text-muted uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="inversor@pachanova.local"
                required 
                className="w-full bg-black/40 text-white p-3 rounded-lg border border-pn-border-strong focus:border-pn-gold focus:ring-1 focus:ring-pn-gold outline-none transition-all placeholder:text-gray-600" 
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-pn-text-muted uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="w-full bg-black/40 text-white p-3 rounded-lg border border-pn-border-strong focus:border-pn-gold focus:ring-1 focus:ring-pn-gold outline-none transition-all" 
              />
            </div>
            
            <button 
              type="submit" 
              className="mt-2 w-full bg-gradient-to-r from-pn-gold/80 to-pn-terracotta/80 hover:from-pn-gold hover:to-pn-terracotta text-black font-semibold p-3 rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]"
            >
              Acceder a mi Portafolio
            </button>
          </form>

          <AdminDemoLogin />

          <div className="mt-6 text-center text-sm text-pn-text-soft">
            ¿No tienes una cuenta?{' '}
            <Link href="/auth/register" className="text-pn-gold hover:text-white transition-colors">
              Crea una aquí
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-pn-text-soft flex justify-center gap-4">
          <Link href="/como-funciona" className="hover:text-pn-gold transition-colors">Ayuda</Link>
          <span>&middot;</span>
          <Link href="/dashboard/investor/disclosures" className="hover:text-pn-gold transition-colors">Términos</Link>
        </div>
      </div>
    </div>
  )
}
