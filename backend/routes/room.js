import express from 'express';
import db from '../models/index.js';

const router = express.Router();

router.get("/hotel/:hotelId", async (req, res) => {
  try {
    const rooms = await db.Room.findAll({
      where: { hotelId: req.params.hotelId }
    });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Error fetching rooms", error: err.message });
  }
});

export default router;