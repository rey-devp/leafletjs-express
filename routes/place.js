import express from "express";
import Location from "../models/location.js";
import mongoose from "mongoose";

const router = express.Router();

/* ===================== GET ALL ===================== */
router.get("/", async (req, res) => {
  try {
    const data = await Location.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===================== GET BY ID ===================== */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const data = await Location.findById(id);
    if (!data) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===================== POST ===================== */
router.post("/", async (req, res) => {
  try {
    const { name, description, category, latitude, longitude } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        error: "name and category are required",
      });
    }

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({
        error: "latitude and longitude must be numbers",
      });
    }

    const location = new Location({
      name,
      description,
      category,
      location: {
        type: "Point",
        coordinates: [longitude, latitude], // ⚠️ lng, lat
      },
    });

    const saved = await location.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===================== PUT ===================== */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, latitude, longitude } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (category) updateData.category = category;

    if (typeof latitude === "number" && typeof longitude === "number") {
      updateData.location = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
    }

    const updated = await Location.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===================== DELETE ===================== */
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const deleted = await Location.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({
      message: "Deleted successfully",
      id: deleted._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
