import { prisma } from "./prisma";
import { createNodes } from "./create-nodes";

const BATCH_SIZE = 100;

async function seed() {
  console.log("Seeding database...");

  const nodes = createNodes();
  console.log(`Found ${nodes.length} courses to seed`);

  // Clear existing data
  await prisma.course.deleteMany();
  console.log("Cleared existing courses");

  // Insert in batches
  let totalCreated = 0;
  for (let i = 0; i < nodes.length; i += BATCH_SIZE) {
    const batch = nodes.slice(i, i + BATCH_SIZE);
    const result = await prisma.course.createMany({
      data: batch.map((node) => ({
        id: node.id,
        title: node.title,
        subject: node.subject,
        description: node.description,
        faculty: node.faculty,
        level: node.level,
        prerequisites: node.prerequisites,
        unlocks: node.unlocks,
      })),
    });
    totalCreated += result.count;
    console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: inserted ${result.count} courses`);
  }

  console.log(`Seeded ${totalCreated} courses total`);
}

seed()
  .then(() => {
    console.log("Seeding complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
