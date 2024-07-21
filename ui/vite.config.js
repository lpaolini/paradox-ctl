import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

const HTTP_PORT = process.env.HTTP_PORT || 80

export default defineConfig({
    server: {
        port: HTTP_PORT,
        strictPort: true,
        host: true,
        origin: `http://0.0.0.0:${HTTP_PORT}`,
        allowedHosts: ['paradox-ui']
    },
    plugins: [
        react()
    ],
    preview: {
        port: HTTP_PORT,
        strictPort: true,
        allowedHosts: ['paradox-ui']
    }
})
