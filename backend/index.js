import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./util/db.js";
import userRoutes from "./routes/user.js";
import hotelRoutes from "./routes/hotel.js";
import countryRoutes from "./routes/country.js";
import tripRoutes from "./routes/trip.js";
import paymentRoutes from "./routes/payment.js"
import roomRoutes from "./routes/room.js";

import { swaggerSpec, swaggerUi } from "./swagger.js";


dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/", hotelRoutes);
app.use("/countries", countryRoutes);
app.use("/trips", tripRoutes);
app.use("/payment", paymentRoutes);
app.use("/rooms", roomRoutes);

app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}/`);
});
