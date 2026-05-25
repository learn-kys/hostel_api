import express from "express";
import { db } from './db/index';
import { hostelOwnerTable, hostelTable, hostelRoomTable } from './db/schema';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", async (req, res) => {
  res.json({message: "backend is working"})
});

// Get all hostel owners with their hostels and rooms
app.get("/owners", async (req, res) => {
  try {
    const owners = await db.query.hostelOwnerTable.findMany({
      with: {
        hostels: {
          with: {
            rooms: true,
          }
        }
      }
    });
    res.json(owners);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch owners" });
  }
});

// Get a specific hostel owner by ID with their hostels and rooms
app.get("/owners/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const owner = await db.query.hostelOwnerTable.findFirst({
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
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch owner" });
  }
});

// Create a new hostel owner
app.post("/create-owner", async (req, res) => {
  const { name, age, email } = req.body;

  // Validation
  if (!name || !age || !email) {
    return res.status(400).json({ error: "Missing required fields: name, age, and email are required." });
  }

  try {
    const newOwner = await db.insert(hostelOwnerTable).values({
      name,
      age,
      email
    }).returning();
    
    res.status(201).json({
      message: "Hostel owner created successfully",
      data: newOwner[0]
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create owner", details: error.message });
  }
});

// Create a new hostel
app.post("/create-hostel", async (req, res) => {
  const { name, address, own_number, owner_id } = req.body;

  // Validation
  if (!name || !address || !own_number || !owner_id) {
    return res.status(400).json({ error: "Missing required fields: name, address, own_number, and owner_id are required." });
  }

  try {
    const newHostel = await db.insert(hostelTable).values({
      name,
      address,
      own_number,
      owner_id
    }).returning();
    
    res.status(201).json({
      message: "Hostel created successfully",
      data: newHostel[0]
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create hostel", details: error.message });
  }
});

// Create a new room
app.post("/create-room", async (req, res) => {
  const { floor, roomNo, capacity, room_rent, after_discount_rent, room_description, facilities, hostel_id } = req.body;

  // Validation
  if (!floor || !roomNo || !capacity || !room_rent || !after_discount_rent || !room_description || !hostel_id) {
    return res.status(400).json({ error: "Missing required fields: floor, roomNo, capacity, room_rent, after_discount_rent, room_description, and hostel_id are required." });
  }

  try {
    const newRoom = await db.insert(hostelRoomTable).values({
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
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create room", details: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});