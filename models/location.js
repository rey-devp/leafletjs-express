import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  {
    collection: "location",
    timestamps: true,
  }
);

// 🗺 wajib untuk GeoJSON
locationSchema.index({ location: "2dsphere" });

export default mongoose.model("Location", locationSchema);
