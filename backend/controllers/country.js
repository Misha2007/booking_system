//import Region from "../models/region.js";
//import Hotel from "../models/hotel.js";
import "../util/db.js";
import models from "../models/index.js";

class countryController {
  constructor() {
    this.HOTELS = [];
  }

  getHotels = async (req, res) => {
    try {
      models.Region.findAll().then((regions) => {
        res.status(200).json({ regions });
      });
    } catch (err) {
      console.error("Error fetching hotels data", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  getHotelsByRegion = async (req, res) => {
    try {
      models.Region.findOne({
        where: { countryName: req.params.country },
      }).then((region) => {
        models.Region.findByPk(region.regionId, {
          include: [
            {
              model: models.Hotel,
              as: "hotels",
              include: [
                {
                  model: models.Image,
                  where: {
                    isCover: true,
                  },
                  required: true,
                },
              ],
            },
          ],
        })
          .then((hotels) => {
            res.status(200).json({ hotels });
          })
          .catch((error) => {
            res.status(500).send(error.message);
          });
      });
    } catch (err) {
      console.error("Error fetching hotels data", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
}

export const CountryController = new countryController();
