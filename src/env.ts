import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1, {
      message: 'BETTER_AUTH_SECRET is required',
    }),
    BETTER_AUTH_URL: z.string().url(),
    RESEND_API_KEY: z
      .string()
      .min(1, { message: 'RESEND_API_KEY is required' }),
    UPLOADTHING_TOKEN: z
      .string()
      .min(1, { message: 'UPLOADTHING_TOKEN is required' }),
    GOOGLE_CLIENT_ID: z.string().min(1, {
      message: 'GOOGLE_CLIENT_ID is required',
    }),
    GOOGLE_CLIENT_SECRET: z.string().min(1, {
      message: 'GOOGLE_CLIENT_SECRET is required',
    }),
  },
  client: {
    NEXT_PUBLIC_URL: z.string().min(1, {
      message: 'NEXT_PUBLIC_URL is required',
    }),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  },
});
