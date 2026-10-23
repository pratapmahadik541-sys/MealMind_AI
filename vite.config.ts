import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import {
  analyzeSurplusWithGemini,
  generateDemandForecastWithGemini,
  chatWithChefMind,
} from './src/server/geminiService.ts';

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/ai/')) {
          return next();
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        // Buffer request body
        const chunks: Buffer[] = [];
        req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        req.on('end', async () => {
          try {
            const rawBody = Buffer.concat(chunks).toString('utf-8');
            const body = rawBody ? JSON.parse(rawBody) : {};

            if (req.url === '/api/ai/decision') {
              const result = await analyzeSurplusWithGemini(
                body.items || [],
                body.context || {
                  canteenName: 'Campus Central Canteen',
                  currentShift: 'Lunch',
                  studentTraffic: 'Moderate-High',
                  weather: 'Overcast & Cool',
                  campusEvent: 'Midterms Preparation',
                }
              );
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, data: result }));
              return;
            }

            if (req.url === '/api/ai/forecast') {
              const result = await generateDemandForecastWithGemini(
                body.context || {
                  targetDate: new Date().toISOString().split('T')[0],
                  mealShift: 'Lunch',
                  dayOfWeek: 'Thursday',
                  weatherCondition: 'Rainy',
                  temperatureC: 14,
                  campusEvent: 'Midterms Exam Week',
                  canteenName: 'Campus Central Canteen',
                }
              );
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, data: result }));
              return;
            }

            if (req.url === '/api/ai/chat') {
              const reply = await chatWithChefMind(body.messages || [], body.context);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, reply }));
              return;
            }

            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'API route not found' }));
          } catch (err: unknown) {
            console.error('Server middleware error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            const message = err instanceof Error ? err.message : 'Internal Server Error';
            res.end(JSON.stringify({ success: false, error: message }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

