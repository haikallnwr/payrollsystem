import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

const databaseName = process.env.DATABASE_NAME || "lsp_payrollsystem";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "123",
  database: databaseName,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter: adapter });

export { prisma };
