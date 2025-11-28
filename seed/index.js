import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Location from "../models/location.js";
import locationSeed from "../seed/location_seed.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

async function seedDB() {
  try {
    const mongoUri = process.env.MONGO_GIS;

    if (!mongoUri) {
      throw new Error("MONGO_GIS environment variable is not set in .env file");
    }

    await mongoose.connect(mongoUri, {
      dbName: "GIS",
    });

    console.log("✅ Mongo connected");

    await Location.deleteMany();
    console.log("🗑 old data cleared");

    await Location.insertMany(locationSeed);
    console.log("✅ location seed inserted");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedDB();
