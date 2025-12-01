// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://ops-dss.github.io',
  base: process.env.BASE_PATH || '/starter-local-astro',
  output: 'static',
  build: {
    assets: '_astro'
  },
  integrations: [react()]
});
