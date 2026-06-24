import { z } from 'zod'

export const loginSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
})

export const productSchema = z.object({
  name:        z.string().min(2),
  description: z.string().min(10),
  price:       z.number().int().positive(),   // cents
  compareAt:   z.number().int().positive().optional(),
  stock:       z.number().int().min(0),
  featured:    z.boolean().default(false),
  categoryId:  z.string().min(1),
  images:      z.array(z.string().url()).min(1, 'Al menos una imagen'),
})

export type LoginInput    = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput  = z.infer<typeof productSchema>
