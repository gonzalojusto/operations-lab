import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
// base: '/operations-lab/' es necesario para GitHub Pages, ya que el sitio
// se sirve desde https://<usuario>.github.io/operations-lab/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/operations-lab/',
});
