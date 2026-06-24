import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// ── Manual .env parsing (no dotenv dependency) ────────────
import { readFileSync } from 'fs'
import { join } from 'path'
try {
  const env = readFileSync(join(process.cwd(), '.env'), 'utf-8')
  for (const line of env.split('\n')) {
    const [k, ...v] = line.split('=')
    if (k && !k.startsWith('#') && v.length) process.env[k.trim()] = v.join('=').trim()
  }
} catch {}

const db = new PrismaClient()

// ── Unsplash images by category ───────────────────────────

const CATEGORIES = [
  {
    name: 'Electrónica', slug: 'electronica',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
  },
  {
    name: 'Ropa', slug: 'ropa',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400',
  },
  {
    name: 'Hogar', slug: 'hogar',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
  },
  {
    name: 'Deportes', slug: 'deportes',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400',
  },
  {
    name: 'Libros', slug: 'libros',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
  },
]

const PRODUCTS = [
  // Electrónica
  {
    categorySlug: 'electronica',
    name: 'Auriculares Premium ANC',
    slug: 'auriculares-premium-anc',
    description: 'Auriculares inalámbricos con cancelación activa de ruido de 40dB, drivers de 40mm, 30 horas de batería y estuche de carga compacto. Perfectos para trabajo remoto y viajes.',
    price: 12900, compareAt: 17900, stock: 25, featured: true,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600',
    ],
  },
  {
    categorySlug: 'electronica',
    name: 'Teclado Mecánico RGB',
    slug: 'teclado-mecanico-rgb',
    description: 'Teclado mecánico TKL con switches ópticos, retroiluminación RGB por tecla, conectividad USB-C y reposamuñecas magnético desmontable. Ideal para gaming y programación.',
    price: 8900, compareAt: null, stock: 18, featured: false,
    images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600'],
  },
  {
    categorySlug: 'electronica',
    name: 'Monitor Ultrawide 34"',
    slug: 'monitor-ultrawide-34',
    description: 'Monitor curvo ultrawide 34 pulgadas, resolución 3440×1440, panel IPS, 144Hz, HDR400, compatible con Thunderbolt 4 y carga de 96W. El espacio de trabajo definitivo.',
    price: 54900, compareAt: 64900, stock: 8, featured: true,
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600'],
  },
  {
    categorySlug: 'electronica',
    name: 'Cámara Mirrorless 24MP',
    slug: 'camara-mirrorless-24mp',
    description: 'Cámara sin espejo de 24 megapíxeles con estabilización en 5 ejes, video 4K 60fps, conectividad WiFi/Bluetooth y batería para 400 disparos. Para creadores de contenido serios.',
    price: 89900, compareAt: 99900, stock: 5, featured: true,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600'],
  },
  // Ropa
  {
    categorySlug: 'ropa',
    name: 'Sudadera Essential',
    slug: 'sudadera-essential',
    description: 'Sudadera unisex de algodón orgánico 300gsm, interior afelpado suave, fit relaxed y costura reforzada en hombros. Disponible en colores neutros para combinar con todo.',
    price: 4900, compareAt: null, stock: 60, featured: true,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
    ],
  },
  {
    categorySlug: 'ropa',
    name: 'Sneakers Urban Pro',
    slug: 'sneakers-urban-pro',
    description: 'Zapatillas urbanas con suela EVA de doble densidad, upper de mesh transpirable, plantilla de memory foam y suela de goma antideslizante. Comodidad todo el día.',
    price: 8900, compareAt: 11900, stock: 35, featured: false,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
  },
  // Hogar
  {
    categorySlug: 'hogar',
    name: 'Lámpara de Escritorio LED',
    slug: 'lampara-escritorio-led',
    description: 'Lámpara LED con temperatura de color ajustable (2700K-6500K), 5 niveles de brillo, puerto USB-A de carga y cabezal articulado a 360°. Certificada para cuidado ocular.',
    price: 3900, compareAt: null, stock: 42, featured: false,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'],
  },
  {
    categorySlug: 'hogar',
    name: 'Soporte Monitor Doble',
    slug: 'soporte-monitor-doble',
    description: 'Soporte de escritorio para dos monitores de hasta 32 pulgadas, altura e inclinación ajustables, gestión de cables integrada y base con peso de 8kg para máxima estabilidad.',
    price: 6900, compareAt: 8900, stock: 15, featured: false,
    images: ['https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600'],
  },
  // Deportes
  {
    categorySlug: 'deportes',
    name: 'Mat de Yoga Premium',
    slug: 'mat-yoga-premium',
    description: 'Esterilla de yoga de caucho natural, 6mm de grosor, superficie antideslizante texturizada, marcas de alineación y bolsa de transporte incluida. Para yoga, pilates y meditación.',
    price: 5900, compareAt: null, stock: 30, featured: false,
    images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600'],
  },
  {
    categorySlug: 'deportes',
    name: 'Botella Térmica 750ml',
    slug: 'botella-termica-750ml',
    description: 'Botella de acero inoxidable de doble pared al vacío, mantiene bebidas frías 24h y calientes 12h, tapa antigoteo y acabado powder coat resistente a arañazos.',
    price: 2900, compareAt: 3900, stock: 80, featured: false,
    images: ['https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600'],
  },
  // Libros
  {
    categorySlug: 'libros',
    name: 'Clean Code — Robert Martin',
    slug: 'clean-code-robert-martin',
    description: 'El libro de referencia absoluto para escribir código limpio, mantenible y escalable. Incluye principios, patrones y prácticas que todo desarrollador profesional debe conocer.',
    price: 3500, compareAt: null, stock: 50, featured: false,
    images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'],
  },
  {
    categorySlug: 'libros',
    name: 'Designing Data-Intensive Apps',
    slug: 'designing-data-intensive-apps',
    description: 'La guía definitiva para sistemas distribuidos: replicación, particionado, transacciones y consistencia. Imprescindible para ingenieros de software que diseñan sistemas a escala.',
    price: 4200, compareAt: 5500, stock: 22, featured: true,
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'],
  },
]

async function main() {
  console.log('🌱 Seeding ShopForge...')

  // Admin user
  const password = await bcrypt.hash('admin1234', 12)
  const admin = await db.user.upsert({
    where:  { email: 'admin@shopforge.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@shopforge.com', password, role: 'ADMIN' },
  })
  console.log(`✓ Admin: ${admin.email}`)

  // Categories
  const catMap = new Map<string, string>()
  for (const cat of CATEGORIES) {
    const c = await db.category.upsert({
      where:  { slug: cat.slug },
      update: {},
      create: cat,
    })
    catMap.set(cat.slug, c.id)
    console.log(`✓ Category: ${c.name}`)
  }

  // Products
  for (const p of PRODUCTS) {
    const { categorySlug, ...data } = p
    const categoryId = catMap.get(categorySlug)!
    await db.product.upsert({
      where:  { slug: data.slug },
      update: {},
      create: { ...data, categoryId },
    })
    console.log(`✓ Product: ${data.name}`)
  }

  console.log('\n✅ Seed completado.')
  console.log('   Admin: admin@shopforge.com / admin1234')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
