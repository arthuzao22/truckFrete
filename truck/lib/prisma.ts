import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const prismaClientSingleton = () => {
  // Use DIRECT_URL if available (for non-pooled connection), otherwise DATABASE_URL
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL

  if (!connectionString) {
    // For build time without database, use a mock URL to allow instantiation
    const mockConnectionString = 'postgresql://user:pass@localhost:5432/db'
    const pool = new Pool({ connectionString: mockConnectionString })
    const adapter = new PrismaPg(pool)
    
    return new PrismaClient({
      adapter,
      log: ['error'],
    })
  }

  // Create a PostgreSQL connection pool
  const pool = new Pool({ connectionString })

  // Create the Prisma adapter
  const adapter = new PrismaPg(pool)

  // Create PrismaClient with the adapter
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma
export { prisma }

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
