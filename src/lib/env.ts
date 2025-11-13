import { z } from "zod";

/**
 * Environment variable validation schema
 * Ensures all required environment variables are present and valid at runtime
 */
const envSchema = z.object({
  // Firebase Client Config (Public - NEXT_PUBLIC_*)
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, "Firebase API Key is required"),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, "Firebase Auth Domain is required"),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, "Firebase Project ID is required"),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, "Firebase Storage Bucket is required"),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, "Firebase Messaging Sender ID is required"),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, "Firebase App ID is required"),

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
 * Validated and type-safe environment variables
 * 
 * @throws {ZodError} If environment validation fails
 */
export const env = envSchema.parse(process.env);

/**
 * Type-safe environment variables
 * Use this type for intellisense and type checking
 */
export type Env = z.infer<typeof envSchema>;
