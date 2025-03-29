import { z } from 'zod'
 
// https://nextjs.org/docs/app/building-your-application/authentication#2-validate-form-fields-on-the-server
export const SignupFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'User name must be at least 2 characters long.' })
    .trim(),
  password: z
    .string()
    .min(4, { message: 'Password must be at least 4 characters long' })
    //.regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    //.regex(/[0-9]/, { message: 'Contain at least one number.' })
    //.regex(/[^a-zA-Z0-9]/, {
    //  message: 'Contain at least one special character.',
    //})
    .trim(),
})
 
export type FormState =
  | {
      errors?: {
        username?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export type SessionPayload = {
    username: string;
    //hashedPassword: string;
    expiresAt: Date;
};