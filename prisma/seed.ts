import { PrismaClient } from '@prisma/client';
import {
  MATERIALS,
  EQUIPMENT,
  ROLES,
  DEFAULT_SITE_CODE,
} from '../lib/constants';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting database seed...');

  // Seed default site
  const defaultSite = await prisma.site.upsert({
    where: { code: DEFAULT_SITE_CODE },
    update: {},
    create: {
      code: DEFAULT_SITE_CODE,
      name: 'Al Asla Recycling Facility',
      location: 'Jeddah, Saudi Arabia',
      timezone: 'Asia/Riyadh',
      isActive: true,
    },
  });

  console.log('✅ Default site created:', defaultSite.code);

  // Seed materials
  for (const material of MATERIALS) {
    await prisma.material.upsert({
      where: { id: material.id },
      update: {
        code: material.code,
        type: material.type,
        name: material.name,
        category: material.category,
        uom: material.uom,
        isFinal: material.isFinal,
        notes: material.notes,
      },
      create: {
        id: material.id,
        code: material.code,
        type: material.type,
        name: material.name,
        category: material.category,
        uom: material.uom,
        isFinal: material.isFinal,
        notes: material.notes,
      },
    });
  }

  console.log(`✅ Seeded ${MATERIALS.length} materials`);

  // Seed equipment
  for (const equipment of EQUIPMENT) {
    await prisma.equipment.upsert({
      where: { id: equipment.id },
      update: {
        code: equipment.code,
        name: equipment.name,
        type: equipment.type,
      },
      create: {
        id: equipment.id,
        code: equipment.code,
        name: equipment.name,
        type: equipment.type,
      },
    });
  }

  console.log(`✅ Seeded ${EQUIPMENT.length} equipment items`);

  // Seed manpower roles
  for (const role of ROLES) {
    await prisma.manpowerRole.upsert({
      where: { code: role.code },
      update: {
        name: role.name,
      },
      create: {
        id: `ROLE_${role.code}`,
        code: role.code,
        name: role.name,
      },
    });
  }

  console.log(`✅ Seeded ${ROLES.length} manpower roles`);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
