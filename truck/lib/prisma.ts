import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  // For Prisma 7 with prisma+postgres URLs, pass the URL as accelerateUrl
  if (process.env.DATABASE_URL?.startsWith('prisma+postgres://')) {
    return new PrismaClient({
      accelerateUrl: process.env.DATABASE_URL,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    } as any)
  }
  
  // For standard postgres:// URLs, use normal PrismaClient
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
