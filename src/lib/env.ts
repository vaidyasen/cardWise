import { z } from "zod";

/**
 * Server-side environment variable validation schema
 * These are only available on the server
 */
const serverEnvSchema = z.object({
  // Firebase Admin SDK (Server-side only)
  FIREBASE_PROJECT_ID: z.string().min(1, "Firebase Admin Project ID is required"),
  FIREBASE_CLIENT_EMAIL: z.string().email("Firebase Client Email must be valid"),
  FIREBASE_PRIVATE_KEY: z.string().min(1, "Firebase Private Key is required"),

  // Database
  DATABASE_URL: z.string().url("Database URL must be a valid URL"),

  // Optional: Logging
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]).optional().default("info"),

  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).optional().default("development"),
});

/**
 * Client-side environment variable validation schema
 * These are exposed to the browser via NEXT_PUBLIC_ prefix
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, "Firebase API Key is required"),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, "Firebase Auth Domain is required"),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, "Firebase Project ID is required"),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, "Firebase Storage Bucket is required"),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, "Firebase Messaging Sender ID is required"),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, "Firebase App ID is required"),
});

/**
 * Validated server-side environment variables
 * Only validates on the server to avoid client-side errors
 */
export const env = typeof window === "undefined" 
  ? serverEnvSchema.parse(process.env)
  : {} as z.infer<typeof serverEnvSchema>;

/**
 * Validated client-side environment variables
 * Validates NEXT_PUBLIC_* variables that are available in the browser
 */
const getClientEnv = () => {
  // In Next.js, NEXT_PUBLIC_* vars are replaced at build time
  // We need to access them directly for proper bundling
  return {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  };
};

export const clientEnv = clientEnvSchema.parse(getClientEnv());

/**
 * Type-safe environment variables
 * Use this type for intellisense and type checking
 */
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
