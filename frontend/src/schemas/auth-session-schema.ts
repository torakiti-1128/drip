import { z } from "zod";

export const AuthUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email()
});

export type AuthUser = z.infer<typeof AuthUserSchema>;
