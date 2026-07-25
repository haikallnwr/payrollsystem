import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const email = process.env.APP_EMAIL as string;
  const rawPassword = process.env.APP_PASSWORD;

  const hashPassword = await bcrypt.hash(rawPassword as string, 14);

  const administrator = await prisma.user.upsert({
    where: {
      email: email,
    },
    update: {},
    create: {
      email: email,
      password: hashPassword,
      role: "ADMIN",
    },
  });

  console.log(`Success seed data administrator: ${administrator.email} (ID: ${administrator.id})`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
