import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import contactRouter from "./contact";
import leadRouter from "./lead";
import { getAllowedOrigins } from "./security";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = getAllowedOrigins(
  process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL
);

app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, !isProduction);
        return;
      }

      if (allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("origin_not_allowed"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Request-Id"],
    optionsSuccessStatus: 204,
  })
);
app.use(express.json({ limit: "10kb" }));

app.use("/api/lead", leadRouter);
app.use("/api/contact", contactRouter);
app.get("/_health", (_req, res) => res.json({ status: "ok" }));

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "not_found" });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof Error && err.message === "origin_not_allowed") {
    return res.status(403).json({ error: "forbidden" });
  }

  return res.status(500).json({ error: "internal_error" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
