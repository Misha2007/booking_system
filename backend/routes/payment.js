import express from "express";
import { Payment } from "../controllers/payment.js";

const router = express.Router();

router.post("/create", Payment.createPaymentWithLineItems);

router.get("/getAll", Payment.getPayments);
router.post("/create-checkout-session", Payment.createPaymentWithLineItems);

export default router;
