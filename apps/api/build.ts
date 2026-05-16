import { execSync } from 'child_process'
import { existsSync, mkdirSync } from 'fs'

if (!existsSync('dist')) mkdirSync('dist')

// Compilar con tsc pero apuntando a todos los archivos necesarios
execSync('npx tsc --module commonjs --target ES2020 --outDir dist --esModuleInterop --skipLibCheck --noEmit false src/index.ts', { stdio: 'inherit' })

console.log('Build completado')
