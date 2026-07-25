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

// Cloud SQL Database Health Check API
app.get("/api/db/health", async (_req, res) => {
  try {
    if (!process.env.SQL_HOST || !process.env.SQL_DB_NAME) {
      return res.json({ status: "not_configured", message: "Cloud SQL environment variables set at deployment runtime." });
    }
    const { db } = await import("./src/db/index.ts");
    const { sql } = await import("drizzle-orm");
    const result = await db.execute(sql`SELECT 1 as connected`);
    res.json({ status: "ok", connected: true, result });
  } catch (error: any) {
    console.error("Database health check error:", error);
    res.status(500).json({ status: "error", error: error.message || "Failed to query Cloud SQL database" });
  }
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
        reply: `🙏 Jai Jinendra!\n\nI am the Jain Connect Global AI Assistant. Here is guidance regarding your inquiry about "${prompt}":\n\n• **Tirth Locations**: Popular Tirths include Palitana Shatrunjaya (Gujarat), Shikharji (Jharkhand), Girnar (Gujarat), Pawapuri (Bihar), and Ranakpur (Rajasthan).\n• **Jain Principles**: Founded on Ahimsa (Non-violence), Satya (Truth), Aparigraha (Non-possession), and Anekantavada (Non-absolutism).\n• **Matrimonial Search Tips**: Ensure Gotra compatibility (avoiding matching father's and mother's gotras), verify educational & sect alignment (Swetambar/Digambar), and review verified profiles on Jain Connect Global.\n• **Emergency Network**: Access our 24/7 Emergency Directory to filter volunteer blood donors by city and blood group.\n\n*(Note: Configure GEMINI_API_KEY for dynamic real-time AI responses)*`,
      });
    }

    const systemInstruction = `You are "Ahimsa AI" - The official Contextual Knowledge & Guidance Assistant for "JAIN CONNECT GLOBAL" (developed by SKJ Tech World).

Your mission is to help Jain community members worldwide find accurate details on:
1. **Tirth Locations & Yatra Guidelines**:
   - Palitana (Shatrunjaya Hills, Bhavnagar, Gujarat): 863 marble temples, first Tirthankara Rishabhdev (Adinath) Bhagwan.
   - Sammed Shikharji (Parasnath Hill, Giridih, Jharkhand): Nirvana Bhumi of 20 Tirthankaras.
   - Girnar Tirth (Junagadh, Gujarat): Nirvana Bhumi of 22nd Tirthankara Lord Neminath.
   - Pawapuri (Nalanda, Bihar): Nirvana Bhumi & Jal Mandir of 24th Tirthankara Lord Mahavira.
   - Ranakpur (Pali, Rajasthan): Famous Chaumukha Temple with 1,444 unique carved marble pillars.
   - Shankheshwar Parshwanath (Patan, Gujarat), Hastinapur (UP), Sonagiri (MP), Taranga, Dilwara (Mount Abu).

2. **Jain Principles & Philosophy**:
   - Core 5 Mahavratas/Anuvratas: Ahimsa (Non-violence in thought, word, and action), Satya (Truthfulness), Asteya (Non-stealing), Brahmacharya (Chastity/Purity), Aparigraha (Non-possessiveness).
   - Anekantavada (Multi-faceted doctrine of truth) and Syadvada (Qualified assertion).
   - Navkar Mantra significance and breakdown (Namo Arihantanam, Namo Siddhanam, Namo Ayriyanam, Namo Uvajjhayanam, Namo Loe Savva Sahunam).
   - Dietary Ethics: Pure vegetarianism (Sattvic), avoidance of root vegetables (Kandmool/Ananthkay like onions, garlic, potatoes), sunset dinner rule (Chouvihar), and Navkarshi/Porshi timings.
   - Festivals: Paryushan Parv, Das Lakshana Parv, Mahavir Jayanti, Diwali (Nirvana Kalyanak of Mahavir Swami), Kshamavani / Samvatsari ("Michhami Dukkadam").

3. **Matrimonial Search Tips & Gotra Compatibility**:
   - Gotra Exclusion Rules: Avoid matching identical Gotra on Father's side and Mother's side.
   - Sect & Sub-sect Alignment: Swetambar (Murtipujak, Sthanakvasi, Terapanthi) vs Digambar (Bisapanthi, Terapanthi, Kanji Panth).
   - Profile verification checklist: Verify education, family background, occupation, and mutual contacts in Jain Samaj directories.

4. **Jain Connect Global Platform Usage**:
   - Business Directory: 5000+ verified Jain businesses.
   - Emergency Directory: Filter volunteer blood donors by blood group (O+, A+, B+, AB+, etc.) and city.
   - Temple & Dharamshala Directory: Find nearby Jain Sangh contact numbers, Bhojanalaya timings, and lodging details.

FORMATTING RULES:
- ALWAYS begin responses with "🙏 Jai Jinendra!".
- Use polite, respectful, and dignified tone.
- Format responses cleanly with bold headings and structured bullet points.
- Keep answers informative, practical, and easy to read.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    const text = response.text || "🙏 Jai Jinendra! Thank you for your question. How else can I assist you on Jain Connect Global?";
    return res.json({ reply: text });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return res.json({
      reply: `🙏 Jai Jinendra!\n\nRegarding your request about "${req.body.prompt}":\n\n• **Tirth Locations**: Explore details for Palitana, Shikharji, Girnar, Pawapuri, and Ranakpur.\n• **Jain Philosophy**: Rooted in Ahimsa, Satya, Aparigraha, and Anekantavada.\n• **Matrimonial Tips**: Verify Gotra exclusions, family background, and sect alignment.\n• **Emergency Blood Donors**: Use our Emergency tab to quickly find donors by city and blood group.`,
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
