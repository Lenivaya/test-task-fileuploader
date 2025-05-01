"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("../../generated/prisma");
// const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
// const prisma = new PrismaClient({ adapter })
var prisma = new prisma_1.PrismaClient({});
exports.default = prisma;
