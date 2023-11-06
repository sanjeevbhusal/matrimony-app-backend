import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.chat.createMany({
    data: [
      {
        userIds: ['64c11ee1ed99d821211b580e', '65463cb3e08491634dcc2300'],
      },
    ],
  });
}

main();
