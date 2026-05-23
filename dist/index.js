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
const app = (0, express_1.default)();
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield index_1.db.query.hostelRoomTable.findMany();
    res.json(data);
}));
// Get all hostel owners with their hostels and rooms
app.get("/owners", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const owners = yield index_1.db.query.hostelOwnerTable.findMany({});
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
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
