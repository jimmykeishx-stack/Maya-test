import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  TWILIO_ACCOUNT_SID: z.string().min(1).optional(),
  TWILIO_AUTH_TOKEN: z.string().min(1).optional(),
  AFRICAS_TALKING_API_KEY: z.string().min(1).optional(),
  SENTRY_DSN: z.string().url().optional(),
  MAYA_HAVEN_APP_URL: z.string().url().default("http://127.0.0.1:3003"),
  MAYA_HAVEN_RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  MAYA_HAVEN_RATE_LIMIT_MAX: z.coerce.number().default(60)
});

export const backendConfig = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  AFRICAS_TALKING_API_KEY: process.env.AFRICAS_TALKING_API_KEY,
  SENTRY_DSN: process.env.SENTRY_DSN,
  MAYA_HAVEN_APP_URL: process.env.MAYA_HAVEN_APP_URL,
  MAYA_HAVEN_RATE_LIMIT_WINDOW_MS: process.env.MAYA_HAVEN_RATE_LIMIT_WINDOW_MS,
  MAYA_HAVEN_RATE_LIMIT_MAX: process.env.MAYA_HAVEN_RATE_LIMIT_MAX
});

export function hasSupabaseCredentials() {
  return Boolean(backendConfig.NEXT_PUBLIC_SUPABASE_URL && backendConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
