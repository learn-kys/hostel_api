"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostelRoomRelations = exports.hostelRelations = exports.hostelOwnerRelations = exports.hostelRoomTable = exports.hostelTable = exports.hostelOwnerTable = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.hostelOwnerTable = (0, pg_core_1.pgTable)("hostel_owner", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    age: (0, pg_core_1.integer)().notNull(),
    email: (0, pg_core_1.varchar)({ length: 255 }).notNull().unique(),
    createdAt_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt_at: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.hostelTable = (0, pg_core_1.pgTable)("hostel", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    address: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    own_number: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    owner_id: (0, pg_core_1.integer)().notNull().references(() => exports.hostelOwnerTable.id),
    createdAt_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt_at: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.hostelRoomTable = (0, pg_core_1.pgTable)("hostel_room", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    floor: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    roomNo: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    capacity: (0, pg_core_1.integer)().notNull(),
    room_rent: (0, pg_core_1.integer)().notNull(),
    after_discount_rent: (0, pg_core_1.integer)().notNull(),
    room_description: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    // facilities should be array list of ac washing machine, tv, wifi, internet, etc.
    facilities: (0, pg_core_1.text)().array(),
    hostel_id: (0, pg_core_1.integer)().notNull().references(() => exports.hostelTable.id),
    createdAt_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt_at: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Relations
exports.hostelOwnerRelations = (0, drizzle_orm_1.relations)(exports.hostelOwnerTable, ({ many }) => ({
    hostels: many(exports.hostelTable),
}));
exports.hostelRelations = (0, drizzle_orm_1.relations)(exports.hostelTable, ({ one, many }) => ({
    owner: one(exports.hostelOwnerTable, {
        fields: [exports.hostelTable.owner_id],
        references: [exports.hostelOwnerTable.id],
    }),
    rooms: many(exports.hostelRoomTable),
}));
exports.hostelRoomRelations = (0, drizzle_orm_1.relations)(exports.hostelRoomTable, ({ one }) => ({
    hostel: one(exports.hostelTable, {
        fields: [exports.hostelRoomTable.hostel_id],
        references: [exports.hostelTable.id],
    }),
}));
