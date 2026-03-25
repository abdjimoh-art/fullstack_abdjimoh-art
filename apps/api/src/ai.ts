import { Router } from "express";
import Groq from "groq-sdk";

const router = Router();

router.post("/chat", async (req, res) => {
  try {
    const message = String(req.body?.message ?? "").trim();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GROQ_API_KEY missing in server env" });
    }

    if (!message) return res.status(400).json({ error: "message is required" });
    if (message.length > 4000) return res.status(400).json({ error: "message too long" });

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      // Pick a model you actually have enabled in Groq console
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a helpful assistant. Keep answers concise and accurate." },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const answer = completion.choices?.[0]?.message?.content ?? "";
    return res.json({ answer });
  } catch (err) {
    return res.status(500).json({ error: "Groq request failed" });
  }
});

export default router;
