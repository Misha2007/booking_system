import "../util/db.js";
import models from "../models/index.js";

class imageController {
  constructor() {
    this.HOTELS = [];
  }

  uploadImage = async (req, res) => {
    try {
      const { imageUrl, target, hotelId, roomInfoId, isCover } = req.body;

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

        if (isCover) {
          await models.Image.update(
            { isCover: false },
            { where: { hotelId, isCover: true } }
          );
        }

        newImage = await models.Image.create({
          url: imageUrl,
          hotelId,
          isCover: !!isCover,
        });
      } else if (target === "room") {
        if (!roomInfoId) {
          return res
            .status(400)
            .json({ message: "Missing roomInfoId for room image" });
        }

        if (isCover) {
          await models.Image.update(
            { isCover: false },
            { where: { roomInfoId, isCover: true } }
          );
        }

        newImage = await models.Image.create({
          url: imageUrl,
          hotelId,
          roomInfoId,
          isCover: !!isCover,
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

  getImagesByHotelId = async (req, res) => {
    try {
      const hotelId = req.params.hotelId;
      const images = await models.Image.findAll({
        where: { hotelId },
        include: [{ model: models.RoomInfo }],
      });
      res.json(images);
    } catch (err) {
      console.error("Error getting images by hotelId", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  deleteImage = async (req, res) => {
    const { imageId } = req.params;
    try {
      const image = await models.Image.findByPk(imageId);
      if (!image) return res.status(404).json({ error: "Image not found" });

      await image.destroy();
      res.status(200).json({ message: "Image deleted" });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  };

  setCoverImage = async (req, res) => {
    const { imageId } = req.params;
    try {
      const image = await models.Image.findByPk(imageId);
      if (!image) return res.status(404).json({ error: "Image not found" });

      await models.Image.update(
        { isCover: false },
        { where: { hotelId: image.hotelId } }
      );

      image.isCover = true;
      await image.save();

      res.status(200).json({ message: "Cover image set" });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  };
}

export const ImageController = new imageController();
