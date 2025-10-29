// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.payItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.attendanceLog.deleteMany();
  await prisma.break.deleteMany();
  await prisma.shiftAssignment.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.document.deleteMany();
  await prisma.file.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.operator.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@securityshifts.local',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create manager user
  const managerPassword = await bcrypt.hash('manager123', 10);
  const manager = await prisma.user.create({
    data: {
      email: 'manager@securityshifts.local',
      password: managerPassword,
      role: 'MANAGER',
    },
  });

  // Create sample operators
  const op1 = await prisma.operator.create({
    data: {
      fullName: 'Marco Rossi',
      phone: '+393331234567',
      codiceFiscale: 'RSSMRC85M10A562S',
      idType: 'id_card',
      idNumber: 'AA1234567',
      contractStatus: 'active',
      hourlyRateCents: 1500, // €15.00
      notes: 'Esperto di sorveglianza',
    },
  });

  const op2 = await prisma.operator.create({
    data: {
      fullName: 'Giulia Verdi',
      phone: '+393339876543',
      codiceFiscale: 'VRDGLI90L45Z123T',
      idType: 'passport',
      idNumber: 'PB123456',
      contractStatus: 'active',
      hourlyRateCents: 1400,
      notes: 'Turni notturni preferiti',
    },
  });

  const op3 = await prisma.operator.create({
    data: {
      fullName: 'Luca Bianchi',
      phone: '+393345555555',
      codiceFiscale: 'BNCLCU88D20M010W',
      contractStatus: 'active',
      hourlyRateCents: 1600,
    },
  });

  // Create sample shops
  const shop1 = await prisma.shop.create({
    data: {
      name: 'Carrefour Milano Centrale',
      address: 'Via Vittor Pisani 12, 20124 Milano',
      latitude: 45.628,
      longitude: 9.204,
      rulesMarkdown: '# Regole Carrefour\n- Divisa borghese obbligatoria\n- Check-in entrata sud',
      extraTasksMarkdown: '- Controllo borse cassa\n- Ronda ogni ora',
      contactName: 'Roberto Ferri',
      contactPhone: '+391234567890',
      defaultHourlyRateCents: 1500,
    },
  });

  const shop2 = await prisma.shop.create({
    data: {
      name: 'Conad Duomo',
      address: 'Via del Duomo 1, 20122 Milano',
      latitude: 45.636,
      longitude: 9.192,
      contactName: 'Maria Rossi',
      contactPhone: '+391111111111',
      defaultHourlyRateCents: 1400,
    },
  });

  // Create sample files
  const file1 = await prisma.file.create({
    data: {
      storageKey: 'uploads/contract-marco.pdf',
      filename: 'Contratto Marco Rossi.pdf',
      mime: 'application/pdf',
      size: 45000,
    },
  });

  // Create sample documents
  await prisma.document.create({
    data: {
      operatorId: op1.id,
      docType: 'contract',
      fileId: file1.id,
      expiryDate: new Date('2026-12-31'),
      notifyDaysBefore: 30,
    },
  });

  // Create sample shifts for next 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const shiftDate = new Date(today);
    shiftDate.setDate(today.getDate() + i);

    // Morning shift
    const morning = new Date(shiftDate);
    morning.setHours(6, 0, 0, 0);
    const morningEnd = new Date(shiftDate);
    morningEnd.setHours(14, 0, 0, 0);

    const shift1 = await prisma.shift.create({
      data: {
        shopId: shop1.id,
        date: shiftDate,
        startAt: morning,
        endAt: morningEnd,
        unpaidBreakMinutes: 30,
        notes: 'Turno mattina - divisa borghese',
        status: 'PLANNED',
      },
    });

    // Assign operators
    await prisma.shiftAssignment.create({
      data: {
        shiftId: shift1.id,
        operatorId: op1.id,
        confirmationStatus: 'PENDING',
      },
    });

    // Evening shift
    const evening = new Date(shiftDate);
    evening.setHours(17, 0, 0, 0);
    const eveningEnd = new Date(shiftDate);
    eveningEnd.setHours(23, 0, 0, 0);

    const shift2 = await prisma.shift.create({
      data: {
        shopId: shop2.id,
        date: shiftDate,
        startAt: evening,
        endAt: eveningEnd,
        unpaidBreakMinutes: 45,
        status: i === 0 ? 'IN_PROGRESS' : 'PLANNED',
      },
    });

    await prisma.shiftAssignment.create({
      data: {
        shiftId: shift2.id,
        operatorId: op2.id,
        confirmationStatus: i === 0 ? 'CONFIRMED' : 'PENDING',
      },
    });

    // Sample attendance logs for today's in-progress shift
    if (i === 0) {
      await prisma.attendanceLog.create({
        data: {
          shiftId: shift2.id,
          operatorId: op2.id,
          eventType: 'CHECK_IN',
          eventSource: 'APP',
          timestamp: new Date(evening.getTime() + 2 * 60000), // 2 mins after start
          latitude: 45.636,
          longitude: 9.192,
        },
      });

      await prisma.attendanceLog.create({
        data: {
          shiftId: shift2.id,
          operatorId: op2.id,
          eventType: 'BREAK_START',
          eventSource: 'APP',
          timestamp: new Date(evening.getTime() + 3 * 3600000), // 3 hours in
          latitude: 45.636,
          longitude: 9.192,
        },
      });
    }

    // Create pay items for completed shifts
    if (i > 0) {
      const actualStart = new Date(morning);
      const actualEnd = new Date(morningEnd);
      const payableMinutes = (actualEnd.getTime() - actualStart.getTime()) / (1000 * 60) - 30;

      await prisma.payItem.create({
        data: {
          shiftId: shift1.id,
          operatorId: op1.id,
          payableMinutes: Math.floor(payableMinutes),
          rateCents: 1500,
          totalCents: Math.floor(payableMinutes * 1500 / 60),
          periodKey: `${shiftDate.getFullYear()}-${String(shiftDate.getMonth() + 1).padStart(2, '0')}`,
          calcSnapshot: {
            method: 'standard',
            grossMinutes: 480,
            unpaidBreakMinutes: 30,
          },
        },
      });
    }
  }

  // Create a sample review
  const completedShift = await prisma.shift.findFirst({
    where: { status: 'COMPLETED' },
  });

  if (completedShift) {
    await prisma.review.create({
      data: {
        shiftId: completedShift.id,
        shopId: completedShift.shopId,
        rating: 5,
        comment: 'Ottimo servizio, puntuale e professionale',
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('\n📝 Test credentials:');
  console.log('   Admin:   admin@securityshifts.local / admin123');
  console.log('   Manager: manager@securityshifts.local / manager123');
  console.log('\n📱 Test operators:');
  console.log('   Marco Rossi:   +393331234567');
  console.log('   Giulia Verdi:  +393339876543');
  console.log('   Luca Bianchi:  +393345555555');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
