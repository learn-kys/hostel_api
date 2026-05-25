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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("./db/index");
const schema_1 = require("./db/schema");
const app = (0, express_1.default)();
// Middleware to parse JSON bodies
app.use(express_1.default.json());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: "backend is working" });
}));
// Get all hostel owners with their hostels and rooms
app.get("/owners", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const owners = yield index_1.db.query.hostelOwnerTable.findMany({
            with: {
                hostels: {
                    with: {
                        rooms: true,
                    }
                }
            }
        });
        res.json(owners);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch owners" });
    }
}));
// Get a specific hostel owner by ID with their hostels and rooms
app.get("/owners/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const owner = yield index_1.db.query.hostelOwnerTable.findFirst({
            where: (owners, { eq }) => eq(owners.id, parseInt(id)),
            with: {
                hostels: {
                    with: {
                        rooms: true,
                    }
                }
            }
        });
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }
        res.json(owner);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch owner" });
    }
}));
// Create a new hostel owner
app.post("/create-owner", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, age, email } = req.body;
    // Validation
    if (!name || !age || !email) {
        return res.status(400).json({ error: "Missing required fields: name, age, and email are required." });
    }
    try {
        const newOwner = yield index_1.db.insert(schema_1.hostelOwnerTable).values({
            name,
            age,
            email
        }).returning();
        res.status(201).json({
            message: "Hostel owner created successfully",
            data: newOwner[0]
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create owner", details: error.message });
    }
}));
// Create a new hostel
app.post("/create-hostel", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, own_number, owner_id } = req.body;
    // Validation
    if (!name || !address || !own_number || !owner_id) {
        return res.status(400).json({ error: "Missing required fields: name, address, own_number, and owner_id are required." });
    }
    try {
        const newHostel = yield index_1.db.insert(schema_1.hostelTable).values({
            name,
            address,
            own_number,
            owner_id
        }).returning();
        res.status(201).json({
            message: "Hostel created successfully",
            data: newHostel[0]
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create hostel", details: error.message });
    }
}));
// Create a new room
app.post("/create-room", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { floor, roomNo, capacity, room_rent, after_discount_rent, room_description, facilities, hostel_id } = req.body;
    // Validation
    if (!floor || !roomNo || !capacity || !room_rent || !after_discount_rent || !room_description || !hostel_id) {
        return res.status(400).json({ error: "Missing required fields: floor, roomNo, capacity, room_rent, after_discount_rent, room_description, and hostel_id are required." });
    }
    try {
        const newRoom = yield index_1.db.insert(schema_1.hostelRoomTable).values({
            floor,
            roomNo,
            capacity,
            room_rent,
            after_discount_rent,
            room_description,
            facilities: facilities || [],
            hostel_id
        }).returning();
        res.status(201).json({
            message: "Room created successfully",
            data: newRoom[0]
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create room", details: error.message });
    }
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
