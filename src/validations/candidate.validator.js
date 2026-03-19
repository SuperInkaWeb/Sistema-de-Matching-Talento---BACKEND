import { z } from 'zod'

export const profileSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  phone: z.string().min(7).max(15),
  city: z.string().min(2),
  country: z.string().min(2),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  portfolio_url: z.string().url().optional().or(z.literal('')),
  resume_url: z.string().optional().or(z.literal('')),
  skills: z.string().min(2),
  address: z.string().optional().or(z.literal('')),
  experience_years: z.union([z.number(), z.string()])
    .transform(val => parseInt(val) || 0)
    .refine(val => val >= 0 && val <= 50, { message: 'Entre 0 y 50 años' }),
  languages: z.union([z.string(), z.array(z.string())]).optional()
})
