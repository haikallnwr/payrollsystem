import { beforeAll, afterAll } from "vitest";
import { prisma } from "../lib/prisma";
import { clearDatabase } from "./helpers/test-db";

beforeAll(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await prisma.$disconnect();
});
