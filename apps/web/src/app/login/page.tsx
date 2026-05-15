import { login } from './actions'
import { DemoLoginSwitcher } from './DemoLoginSwitcher'

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-pn-bg text-pn-text">
      <div className="w-80 max-w-full">
        <form action={login} className="flex flex-col gap-4">
          <label htmlFor="email" className="text-sm font-medium">Email:</label>
          <input id="email" name="email" type="email" required className="text-black p-2 rounded border border-pn-border bg-white" />
          
          <label htmlFor="password" className="text-sm font-medium mt-2">Contraseña:</label>
          <input id="password" name="password" type="password" required className="text-black p-2 rounded border border-pn-border bg-white" />
          
          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium p-2 rounded w-full transition-colors">Ingresar</button>
          </div>
        </form>
        
        <div className="mt-6 text-sm text-pn-text-soft text-center">
          ¿No tienes cuenta? <a href="/signup" className="text-blue-600 hover:underline">Crear cuenta</a>
        </div>

        <DemoLoginSwitcher />
      </div>
    </div>
  )
}
