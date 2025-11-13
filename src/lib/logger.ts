import pino from "pino";
import { env } from "./env";

const logger = pino({
  level: env.LOG_LEVEL,
  browser: {
    asObject: true,
  },
  // Don't use pino-pretty transport in Next.js - it causes worker issues
  // Instead, use basic formatting
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
});

export default logger;
