import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
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
