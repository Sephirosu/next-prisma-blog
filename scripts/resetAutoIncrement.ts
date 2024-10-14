import prisma from "../lib/prisma";

async function resetDatabase() {
  try {
    console.log("Resetting database...");

    await prisma.verificationToken.deleteMany();
    await prisma.authenticator.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.blogPost.deleteMany();

    await prisma.user.deleteMany();
    await prisma.category.deleteMany();

    await prisma.$executeRawUnsafe(
      'DELETE FROM sqlite_sequence WHERE name = "User"'
    );
    await prisma.$executeRawUnsafe(
      'DELETE FROM sqlite_sequence WHERE name = "BlogPost"'
    );
    await prisma.$executeRawUnsafe(
      'DELETE FROM sqlite_sequence WHERE name = "Category"'
    );

    console.log("Database reset successfully!");
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
