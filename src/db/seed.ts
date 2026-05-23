import { db } from './index';
import { hostelOwnerTable, hostelTable, hostelRoomTable } from './schema';

async function main() {
  console.log('Seeding database...');

  try {
    // Clear existing data to ensure idempotent seeding
    console.log('Clearing existing data...');
    await db.delete(hostelRoomTable);
    await db.delete(hostelTable);
    await db.delete(hostelOwnerTable);

    // 1. Seed Owners
    console.log('Seeding owners...');
    const owners = await db.insert(hostelOwnerTable).values([
      { name: 'amit kumar', age: 45, email: 'amit@gmail.com' },
      { name: 'Raman Kumar', age: 38, email: 'raman123@gmail.com' },
    ]).returning();

    // 2. Seed Hostels
    console.log('Seeding hostels...');
    const hostels = await db.insert(hostelTable).values([
      {
        name: 'Roohi Hostel',
        address: 'Danapur',
        own_number: '+919122080561',
        owner_id: owners[0].id,
      },
      {
        name: 'Aadarsh Hostel',
        address: 'Patna Junction',
        own_number: '+91987654321',
        owner_id: owners[1].id,
      },
    ]).returning();

    // 3. Seed Rooms
    console.log('Seeding rooms...');
    await db.insert(hostelRoomTable).values([
      {
        floor: '1st',
        roomNo: '101',
        capacity: 2,
        room_rent: 500,
        after_discount_rent: 450,
        room_description: 'Best hostel in town',
        facilities: ['AC', 'WiFi', 'TV'],
        hostel_id: hostels[0].id,
      },
      {
        floor: '2nd',
        roomNo: '102',
        capacity: 4,
        room_rent: 800,
        after_discount_rent: 750,
        room_description: 'Best for group',
        facilities: ['AC', 'WiFi', 'Washing Machine'],
        hostel_id: hostels[0].id,
      },
      {
        floor: '2nd',
        roomNo: '201',
        capacity: 1,
        room_rent: 300,
        after_discount_rent: 300,
        room_description: 'best for focused work',
        facilities: ['Heater', 'WiFi'],
        hostel_id: hostels[1].id,
      }
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
