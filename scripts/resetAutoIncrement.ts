import prisma from "@lib/prisma";

async function resetAutoIncrement() {
  try {
    await prisma.$executeRawUnsafe(
      'DELETE FROM sqlite_sequence WHERE name = "User"'
    );
    await prisma.$executeRawUnsafe(
      'DELETE FROM sqlite_sequence WHERE name = "BlogPost"'
    );
    await prisma.$executeRawUnsafe(
      'DELETE FROM sqlite_sequence WHERE name = "Category"'
    );

    console.log("Auto-increment IDs reset successfully!");
  } catch (error) {
    console.error("Error resetting auto-increment:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAutoIncrement();
