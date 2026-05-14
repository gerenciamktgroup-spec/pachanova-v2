import { signup } from './actions'

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-950 text-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light text-pn-gold tracking-tight mb-2">PachaNova Demo</h1>
        <p className="text-sm text-pn-text-muted">Crea una cuenta para simular como inversor</p>
      </div>
      
      <form action={signup} className="flex flex-col gap-4 w-80 max-w-full">
        <label htmlFor="fullName" className="text-sm">Nombre Completo:</label>
        <input id="fullName" name="fullName" type="text" required className="text-black p-2 rounded" placeholder="Ej. Ana Torres" />
        
        <label htmlFor="email" className="text-sm">Email:</label>
        <input id="email" name="email" type="email" required className="text-black p-2 rounded" placeholder="ana@ejemplo.com" />
        
        <label htmlFor="password" className="text-sm">Contraseña:</label>
        <input id="password" name="password" type="password" required minLength={8} className="text-black p-2 rounded" placeholder="Mínimo 8 caracteres" />
        
        <div className="flex flex-col gap-2 mt-4">
          <button type="submit" className="bg-pn-gold hover:bg-pn-gold/90 text-pn-bg font-medium p-2 rounded w-full transition-colors">Crear cuenta</button>
        </div>
      </form>
      
      <div className="mt-6 text-sm text-pn-text-muted">
        ¿Ya tienes cuenta? <a href="/login" className="text-pn-gold hover:underline">Ingresar aquí</a>
      </div>
    </div>
  )
}
