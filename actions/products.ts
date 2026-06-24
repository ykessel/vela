'use server'

import { db } from '@/lib/db'
import { productSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import slugify from 'slugify'

export type ProductFormData = {
  name: string
  description: string
  price: string       // dollars, e.g. "129.00"
  compareAt: string   // dollars or empty
  stock: string
  featured: boolean
  categoryId: string
  images: string      // one URL per line
}

function parseForm(data: ProductFormData) {
  const compareAtRaw = data.compareAt.trim()
  return {
    name:        data.name.trim(),
    description: data.description.trim(),
    price:       Math.round(parseFloat(data.price) * 100),
    compareAt:   compareAtRaw ? Math.round(parseFloat(compareAtRaw) * 100) : undefined,
    stock:       parseInt(data.stock, 10),
    featured:    data.featured,
    categoryId:  data.categoryId,
    images:      data.images.split('\n').map(u => u.trim()).filter(Boolean),
  }
}

export async function createProduct(data: ProductFormData) {
  const parsed = productSchema.safeParse(parseForm(data))
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  let slug = slugify(parsed.data.name, { lower: true, strict: true })
  const conflict = await db.product.findUnique({ where: { slug } })
  if (conflict) slug = `${slug}-${Date.now()}`

  await db.product.create({ data: { ...parsed.data, slug } })

  revalidatePath('/admin/products')
  revalidatePath('/')
  redirect('/admin/products')
}

export async function updateProduct(id: string, data: ProductFormData) {
  const parsed = productSchema.safeParse(parseForm(data))
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  await db.product.update({
    where: { id },
    data: {
      name:        parsed.data.name,
      description: parsed.data.description,
      price:       parsed.data.price,
      compareAt:   parsed.data.compareAt ?? null,
      stock:       parsed.data.stock,
      featured:    parsed.data.featured,
      categoryId:  parsed.data.categoryId,
      images:      parsed.data.images,
    },
  })

  revalidatePath('/admin/products')
  revalidatePath('/')
  redirect('/admin/products')
}
