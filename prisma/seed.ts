import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();
const PASSWORD = "Password123!";

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  const users = [
    { name: "Admin", email: "admin@localimpact.test", role: "ADMIN" as const },
    { name: "Manager", email: "manager@localimpact.test", role: "MANAGER" as const },
    { name: "Student", email: "user@localimpact.test", role: "USER" as const },
  ];
  for (const u of users) {
    await db.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash },
    });
  }

  for (const name of ["Equipment", "Accessibility", "Lighting", "Cleanliness", "IT"]) {
    await db.category.upsert({ where: { name }, update: {}, create: { name } });
  }
  for (const name of ["Library", "Block A", "Block B", "Cafeteria", "Parking"]) {
    await db.location.upsert({ where: { name }, update: {}, create: { name } });
  }

  console.log("Seeded. Password for all demo accounts:", PASSWORD);
}

main().finally(() => db.$disconnect());