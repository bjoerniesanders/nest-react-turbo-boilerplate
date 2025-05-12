/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vitest/config';
import { defineConfig as viteDefineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default mergeConfig(
  viteDefineConfig({
    plugins: [react()]
  }),
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      coverage: {
        reporter: ['text', 'json', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/*.{test,spec}.{ts,tsx}'],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  })
); 