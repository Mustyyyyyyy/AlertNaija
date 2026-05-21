const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.policeStation.createMany({
    data: [
      {
        name: "Ikeja Police Station",
        latitude: 6.6018,
        longitude: 3.3515,
      },

      {
        name: "Lekki Police Station",
        latitude: 6.4698,
        longitude: 3.5852,
      },

      {
        name: "Yaba Police Station",
        latitude: 6.5095,
        longitude: 3.3711,
      },
    ],
  });

  console.log("Police stations seeded");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });