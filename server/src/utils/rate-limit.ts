import { Request, Response, NextFunction } from "express";

// A small in-memory limiter (per client IP), enough to stop one caller from
// flooding an open endpoint. It resets when the server restarts.
export const rateLimit = (options: {
  windowMs: number;
  max: number;
  message: string;
}) => {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = req.ip || "unknown";

    for (const [ip, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(ip);
    }

    const entry = hits.get(key) ?? { count: 0, resetAt: now + options.windowMs };
    entry.count += 1;
    hits.set(key, entry);

    if (entry.count > options.max) {
      res.status(429).json({ success: false, message: options.message });
      return;
    }
    next();
  };
};
