import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Spider-Sense AI Chronologist & Continuity Endpoint
app.post('/api/ai/chronologist', async (req, res) => {
  try {
    const { prompt, currentArc, readingContext, filterVillain } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'A valid prompt string is required.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback knowledge response if key is missing or local dev
      res.json({
        advice: `[Spider-Sense Local Database]: Brand New Day marks Amazing Spider-Man #546 through #647. For your query "${prompt}", the essential starting point is the "Brand New Day" intro arc (#546-564) leading into "New Ways to Die" (#568-573) featuring Anti-Venom and Norman Osborn's Thunderbolts! Note: Configure GEMINI_API_KEY in Settings > Secrets for live deep neural chronologist analysis.`,
        keyIssues: ['ASM #546', 'ASM #568', 'ASM #600', 'ASM #612', 'ASM #634'],
        threatLevel: 'Medium-High',
        continuityNote: 'Peter Parker is back to single life, web-shooters restored, working for Front Line / Daily Bugle, while Mister Negative and Menace emerge in NYC.',
      });
      return;
    }

    const systemInstruction = `You are "Spider-Sense AI Chronologist", the ultimate Marvel Comics Spider-Man continuity expert and reading guide archivist, especially focused on the triple-shipping "Brand New Day" era (Amazing Spider-Man #546-647), the "Big Time" era (#648-700), and related crossovers (Swing Shift, Spider-Man Extra!, Secret Invasion, Dark Reign, The Gauntlet, Grim Hunt, Origin of the Species).

Your tone: Knowledgeable, witty, comic-lore accurate, energetic like Peter Parker / Spider-Man archivist.
When answering, always provide:
1. Direct, clear reading advice or continuity explanation.
2. Recommended specific issue numbers with exact titles and release context.
3. Spider-Sense Threat Level / Importance rating.
4. Fast tip for whether it's an essential core issue or a fun side tie-in.

Keep answers well-structured and engaging for both new readers and hardcore comic collectors.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `User Query: ${prompt}
Current Context:
- Active Arc in View: ${currentArc || 'All Arcs'}
- Filter Villain: ${filterVillain || 'None'}
- Reader Progress Context: ${readingContext ? JSON.stringify(readingContext) : 'Standard Reading Session'}`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      advice: response.text || 'Spider-sense buzzing, but no transmission received.',
      success: true,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chronologist:', error);
    res.status(500).json({
      error: 'Failed to consult Spider-Sense Chronologist',
      details: error?.message || String(error),
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🕷️ Web-Slinger server running on http://localhost:${PORT}`);
  });
}

startServer();
