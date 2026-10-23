import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  analyzeSurplusWithGemini,
  generateDemandForecastWithGemini,
  chatWithChefMind,
} from './src/server/geminiService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// API route: AI Decision Engine
app.post('/api/ai/decision', async (req, res) => {
  try {
    const { items, context } = req.body;
    const result = await analyzeSurplusWithGemini(items || [], context || {
      canteenName: 'Campus Central Canteen',
      currentShift: 'Lunch',
      studentTraffic: 'Moderate-High',
      weather: 'Overcast & Cool',
      campusEvent: 'Midterms Preparation',
    });
    res.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error('Error in /api/ai/decision:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    res.status(500).json({ success: false, error: message });
  }
});

// API route: Demand Forecasting
app.post('/api/ai/forecast', async (req, res) => {
  try {
    const { context } = req.body;
    const result = await generateDemandForecastWithGemini(context || {
      targetDate: new Date().toISOString().split('T')[0],
      mealShift: 'Lunch',
      dayOfWeek: 'Thursday',
      weatherCondition: 'Rainy',
      temperatureC: 14,
      campusEvent: 'Midterms Exam Week',
      canteenName: 'Campus Central Canteen',
    });
    res.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error('Error in /api/ai/forecast:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    res.status(500).json({ success: false, error: message });
  }
});

// API route: ChefMind Chatbot
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, context } = req.body;
    const reply = await chatWithChefMind(messages || [], context);
    res.json({ success: true, reply });
  } catch (error: unknown) {
    console.error('Error in /api/ai/chat:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    res.status(500).json({ success: false, error: message });
  }
});

// Serve static assets in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`MealMind AI server listening on http://0.0.0.0:${PORT}`);
});
