import { Router } from 'express';
import { z } from 'zod';

const router = Router();

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional(),
  message: z.string().min(1).max(2000),
});

// Simple in-memory rate limiter (per IP): max 5 submissions per 10 minutes
const rateWindowMs = 10 * 60 * 1000; // 10 minutes
const maxRequestsPerWindow = 5;
const ipMap = new Map<string, { count: number; firstTs: number }>();

router.post('/', async (req, res) => {
  try {
    const ip = (req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '') as string;

    const record = ipMap.get(ip) || { count: 0, firstTs: Date.now() };
    const now = Date.now();
    if (now - record.firstTs > rateWindowMs) {
      record.count = 0;
      record.firstTs = now;
    }

    record.count += 1;
    ipMap.set(ip, record);

    if (record.count > maxRequestsPerWindow) {
      return res.status(429).json({ error: 'rate_limited' });
    }

    const parsed = ContactSchema.parse(req.body);
    const n8nUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678';

    // Forward payload to n8n webhook
    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('n8n error:', text);
      return res.status(502).json({ error: 'n8n_forward_error', detail: text });
    }

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'validation_error', detail: err.errors });
    }
    console.error(err);
    return res.status(500).json({ error: 'internal_error' });
  }
});

export default router;
