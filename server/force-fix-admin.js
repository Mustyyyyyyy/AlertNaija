require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function cleanAdmin() {
  console.log('🧹 Cleaning up messy admin accounts...');
  
  // Delete ANY user that looks like an admin or has messy quotes
  await prisma.user.deleteMany({
    where: {
      OR: [
        { email: { contains: 'admin' } },
        { email: { contains: '\"' } },
        { email: { contains: ';' } }
      ]
    }
  });

  console.log('✨ Creating clean Admin account...');
  const hashed = await bcrypt.hash('admin12345', 10);
  await prisma.user.create({
    data: {
      fullName: 'AlertNaija Admin',
      email: 'admin@alertnaija.ng',
      phone: '08123456789',
      password: hashed,
      role: 'ADMIN',
      state: 'FCT'
    }
  });

  console.log('✅ DONE! You can now login with: admin@alertnaija.ng / admin12345');
  await prisma.$disconnect();
}

cleanAdmin();
