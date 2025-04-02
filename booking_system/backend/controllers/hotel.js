/*
const router = express.Router();

router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


router.get('/hotels', async (req, res) => {
    try {
        const hotels = await Hotels.findAll();
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hotels' });
    }
});

*/
//import { Hotels } from "../models/hotel.js";
import Hotel from "../models/hotel.js";
import "../util/db.js";

class hotelController {
  constructor() {
    this.HOTELS = [];
  }

  getHotels = async (req, res) => {
    try {
      const hotels = await Hotel.findAll();
      console.log(hotels)

      if (!hotels) {
        return res.status(404).json({ message: "Hotels not found" });
      }

      res.json({ hotels: hotels });
    } catch (err) {
      console.error("Error fetching hotels data", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
}

export const HotelController = new hotelController();
