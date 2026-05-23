"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const schema_1 = require("./schema");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Seeding database...');
        try {
            // Clear existing data to ensure idempotent seeding
            console.log('Clearing existing data...');
            yield index_1.db.delete(schema_1.hostelRoomTable);
            yield index_1.db.delete(schema_1.hostelTable);
            yield index_1.db.delete(schema_1.hostelOwnerTable);
            // 1. Seed Owners
            console.log('Seeding owners...');
            const owners = yield index_1.db.insert(schema_1.hostelOwnerTable).values([
                { name: 'John Doe', age: 45, email: 'john.doe@example.com' },
                { name: 'Jane Smith', age: 38, email: 'jane.smith@example.com' },
            ]).returning();
            // 2. Seed Hostels
            console.log('Seeding hostels...');
            const hostels = yield index_1.db.insert(schema_1.hostelTable).values([
                {
                    name: 'Sunshine Hostel',
                    address: '123 Sunny St, Beachville',
                    own_number: '+1234567890',
                    owner_id: owners[0].id,
                },
                {
                    name: 'Mountain View Lodge',
                    address: '456 Pine Rd, PeakTown',
                    own_number: '+1987654321',
                    owner_id: owners[1].id,
                },
            ]).returning();
            // 3. Seed Rooms
            console.log('Seeding rooms...');
            yield index_1.db.insert(schema_1.hostelRoomTable).values([
                {
                    floor: '1st',
                    roomNo: '101',
                    capacity: 2,
                    room_rent: 500,
                    after_discount_rent: 450,
                    room_description: 'Cozy double room near the entrance.',
                    facilities: ['AC', 'WiFi', 'TV'],
                    hostel_id: hostels[0].id,
                },
                {
                    floor: '1st',
                    roomNo: '102',
                    capacity: 4,
                    room_rent: 800,
                    after_discount_rent: 750,
                    room_description: 'Spacious room for a group.',
                    facilities: ['AC', 'WiFi', 'Washing Machine'],
                    hostel_id: hostels[0].id,
                },
                {
                    floor: '2nd',
                    roomNo: '201',
                    capacity: 1,
                    room_rent: 300,
                    after_discount_rent: 300,
                    room_description: 'Quiet single room with mountain view.',
                    facilities: ['Heater', 'WiFi'],
                    hostel_id: hostels[1].id,
                }
            ]);
            console.log('Database seeded successfully!');
        }
        catch (error) {
            console.error('Error seeding database:', error);
            process.exit(1);
        }
        finally {
            process.exit(0);
        }
    });
}
main();
