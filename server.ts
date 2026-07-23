import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side Gemini API client initialization
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    appName: "Jain Connect Global",
    developer: "SKJ Tech World",
    time: new Date().toISOString()
  });
});

// AI Search Assistant Route (Gemini 3.6 Flash)
app.post("/api/ai/assistant", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: `🙏 Jai Jinendra! You asked: "${prompt}".\n\nI am the Jain Connect Global AI Assistant. I can help you search for Jain Tirths (like Palitana, Shikharji), Panchang Tithis, Business listings, and Matrimonial guidance across our platform. (Developed by SKJ Tech World).`,
      });
    }

    const systemInstruction = `You are the AI Assistant for "JAIN CONNECT GLOBAL" - One Platform for Every Jain, Every Business, Every Temple, Every Family (Developed by SKJ Tech World).
Always begin your answer with "🙏 Jai Jinendra!".
Provide clear, authentic, and polite answers regarding Jain philosophy, Ahimsa, Agam principles, Jain Tirths (Palitana, Shikharji, Girnar, Pawapuri, Ranakpur), Jain Panchang (Choghadiya, Tithi), and how to use the Jain Connect Global directory.
Keep responses concise, formatted nicely with bullet points where appropriate.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    const text = response.text || "🙏 Jai Jinendra! Thank you for reaching out. How else can I assist you in Jain Connect Global?";
    return res.json({ reply: text });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return res.json({
      reply: `🙏 Jai Jinendra! I encountered a brief connection issue. Jain Connect Global features directories for 800+ Temples, 5000+ Verified Businesses, and 1200+ Matrimonial profiles. How can I guide you today?`,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Jain Connect Global Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
