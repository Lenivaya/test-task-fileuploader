import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '../env'
import { PrismaClient } from '../../generated/prisma'

// const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
// const prisma = new PrismaClient({ adapter })
const prisma = new PrismaClient({})

export default prisma
