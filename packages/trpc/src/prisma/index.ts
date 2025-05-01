// import { PrismaPg } from '@prisma/adapter-pg'
// import { env } from '../env'
import { PrismaClient } from '../../generated/prisma'

// seems like broken since last prisma update, use default client for now
// [1]: https://github.com/prisma/prisma/issues/27050
// [2]: https://github.com/prisma/prisma/issues/27042
//
// const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
// const prisma = new PrismaClient({ adapter })
const prisma = new PrismaClient({})

export default prisma
