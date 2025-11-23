import * as bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

export async function main() {
  console.log("Seeding Start -----");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("12345678", salt);

  await prisma.user.create({
    data: {
      phone: "778661260",
      password: hashedPassword,
      randToken: "12jhgsiufy7ib876873rkj",
    },
  });
  console.log("Seeding Finished ----");
}

main();
