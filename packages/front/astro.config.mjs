// @ts-check
import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [vue()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        allow: [
          '/mnt/datos/dev/proyects/internships',
          '/mnt/datos/dev/proyects/internships/node_modules',
        ],
      },
    },
  },
  server: { port: 5173 },
})
