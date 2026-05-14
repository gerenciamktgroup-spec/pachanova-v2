import { login } from './actions'

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-950 text-white">
      <form action={login} className="flex flex-col gap-4 w-80 max-w-full">
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required className="text-black p-2 rounded" />
        
        <label htmlFor="password">Contraseña:</label>
        <input id="password" name="password" type="password" required className="text-black p-2 rounded" />
        
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 p-2 rounded w-full">Ingresar</button>
        </div>
      </form>
    </div>
  )
}
