import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '176a-2405-201-a410-b135-d430-7ceb-f555-7db0.ngrok-free.app', // Add your specific ngrok host here
      'b8c8-2405-201-a410-b135-69f4-e646-8562-860.ngrok-free.app', // Add your specific ngrok host here
    ],
  },
});