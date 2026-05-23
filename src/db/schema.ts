import { relations } from "drizzle-orm";
import { integer, pgTable, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const hostelOwnerTable = pgTable("hostel_owner", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),

  createdAt_at: timestamp("created_at").defaultNow(),
  updatedAt_at: timestamp("updated_at").defaultNow(),
});

export const hostelTable = pgTable("hostel", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  address: varchar({ length: 255 }).notNull(),
  own_number: varchar({ length: 255 }).notNull(),
  owner_id: integer().notNull().references(() => hostelOwnerTable.id),


  createdAt_at: timestamp("created_at").defaultNow(),
  updatedAt_at: timestamp("updated_at").defaultNow(),
});

export const hostelRoomTable = pgTable("hostel_room", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  floor: varchar({ length: 255 }).notNull(),
  roomNo: varchar({ length: 255 }).notNull(),
  capacity: integer().notNull(),
  room_rent: integer().notNull(),
  after_discount_rent: integer().notNull(),
  room_description: varchar({ length: 255 }).notNull(),
  // facilities should be array list of ac washing machine, tv, wifi, internet, etc.
  facilities: text().array(),
  hostel_id: integer().notNull().references(() => hostelTable.id),


  createdAt_at: timestamp("created_at").defaultNow(),
  updatedAt_at: timestamp("updated_at").defaultNow(),
});

// Relations
export const hostelOwnerRelations = relations(hostelOwnerTable, ({ many }) => ({
  hostels: many(hostelTable),
}));

export const hostelRelations = relations(hostelTable, ({ one, many }) => ({
  owner: one(hostelOwnerTable, {
    fields: [hostelTable.owner_id],
    references: [hostelOwnerTable.id],
  }),
  rooms: many(hostelRoomTable),
}));

export const hostelRoomRelations = relations(hostelRoomTable, ({ one }) => ({
  hostel: one(hostelTable, {
    fields: [hostelRoomTable.hostel_id],
    references: [hostelTable.id],
  }),
}));

