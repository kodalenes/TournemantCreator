import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Maps Vercel's VITE_API_KEY to the process.env.API_KEY used in the code
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
      // Prevent crash if process is accessed elsewhere
      'process.env': {}
    },
  };
});