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
                { name: 'amit kumar', age: 45, email: 'amit@gmail.com' },
                { name: 'Raman Kumar', age: 38, email: 'raman123@gmail.com' },
            ]).returning();
            // 2. Seed Hostels
            console.log('Seeding hostels...');
            const hostels = yield index_1.db.insert(schema_1.hostelTable).values([
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
            yield index_1.db.insert(schema_1.hostelRoomTable).values([
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
