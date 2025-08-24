import path                      from "path"
import tailwindcss               from "@tailwindcss/vite"
import { defineConfig, loadEnv } from 'vite'
import react                     from '@vitejs/plugin-react'
import tsconfigPaths             from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const PORT = 5174

  return ({
    server: {
      open: true,
      // this sets a default port to 5174
      port: PORT,
      host: true,
      proxy: {
        '/api/v1': {
          target: env.SF_API_HOST
            ? `http://${env.SF_API_HOST}`
            : 'http://panic.taile5ef8e.ts.net',
          // : 'http://sf-server-0.taile5ef8e.ts.net',
          changeOrigin: true,
        },
      },
      cors: {
        origin: [
          /^https?:\/\/localhost/,
          /^https?:\/\/127.0.0.1/,
          /^https?:\/\/::1/,
          /^https?:\/\/panic/,
        ],
      },
    },

    plugins: [react(), tsconfigPaths(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  })
})
