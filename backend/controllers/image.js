import "../util/db.js";
import models from "../models/index.js";

class imageController {
  constructor() {
    this.HOTELS = [];
  }

  uploadImage = async (req, res) => {
    try {
      const { imageUrl, target, hotelId, roomInfoId } = req.body;

      if (!imageUrl || !target) {
        return res.status(400).json({ message: "Missing imageUrl or target" });
      }

      let newImage;

      if (target === "hotel") {
        if (!hotelId) {
          return res
            .status(400)
            .json({ message: "Missing hotelId for hotel image" });
        }

        newImage = await models.Image.create({
          url: imageUrl,
          hotelId,
        });
      } else if (target === "room") {
        if (!roomInfoId) {
          return res
            .status(400)
            .json({ message: "Missing roomInfoId for room image" });
        }

        newImage = await models.Image.create({
          url: imageUrl,
          hotelId,
          roomInfoId,
        });
      } else {
        return res.status(400).json({ message: "Invalid target type" });
      }

      res.status(201).json({ image: newImage });
    } catch (err) {
      console.error("Error uploading an image", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
}

export const ImageController = new imageController();
