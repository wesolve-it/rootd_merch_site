// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';

// Alle Seiten werden statisch gerendert. Nur /tina-island (Live-Vorschau im
// Tina-Editor) läuft on-demand – auf Netlify als Function, lokal über Node.
async function getAdapter() {
  if (process.env.NETLIFY) return (await import('@astrojs/netlify')).default();
  return (await import('@astrojs/node')).default({ mode: 'standalone' });
}

export default defineConfig({
  site: 'https://www.rooted-merch.de',
  output: 'static',
  adapter: await getAdapter(),
  integrations: [tina()],
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss(), tinaAdminDevRedirect()],
    ssr: {
      noExternal: ['@tinacms/astro', '@tinacms/bridge'],
    },
  },
});
