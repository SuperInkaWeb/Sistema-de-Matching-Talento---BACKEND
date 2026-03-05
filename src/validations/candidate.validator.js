import { z } from 'zod'

export const profileSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  phone: z.string().min(7).max(15),
  city: z.string().min(2),
  country: z.string().min(2),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  portfolio_url: z.string().url().optional().or(z.literal('')),
  resume_url: z.string().url().optional().or(z.literal('')),
  skills: z.string().min(2),
  experience_years: z.number().int().min(0).max(50)
})
