import Stripe from "stripe";

import dotenv from "dotenv";
import RoomInfo from "../models/roominfo.js";
import Hotel from "../models/hotel.js";
import Room from "../models/room.js";
dotenv.config();

const stripe = new Stripe(process.env.secretKey);

class payment {
  constructor() {
    this.payments = [];
  }

  // Handle the payment process
  createPaymentWithLineItems = async (req, res) => {
    try {
      const { customerEmail, bookingData } = req.body;

      const customer = await stripe.customers.create({
        email: customerEmail,
      });

      const hotelData = await Hotel.findByPk(bookingData.hotelId);
      const roomInfo = await RoomInfo.findOne({
        where: {
          hotelId: bookingData.hotelId,
          roomId: bookingData.roomId,
        },
      });

      if (!roomInfo) {
        return res
          .status(404)
          .json({ error: "Room not found for selected hotel." });
      }

      const fromDate = new Date(bookingData.departureDate);
      const toDate = new Date(bookingData.arrivalDate);

      const dayCount =
        Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) || 1;

      const amount = roomInfo.basePrice * dayCount;

      const room = await Room.findByPk(bookingData.roomId);
      console.log(room);

      const description = `Booking for ${room.roomType} room in ${hotelData.name} - ${dayCount} night(s)`;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "eur",
        customer: customer.id,
        description: description,
        metadata: {
          product_description: description,
          email: customerEmail,
          roomId: bookingData.roomId,
          hotelId: bookingData.hotelId,
          numberOfGuests: bookingData.numberOfGuests,
        },
        receipt_email: customerEmail,
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error during payment creation:", error);
      res.status(500).json({ error: error.message });
    }
  };

  getPayments = async (req, res) => {
    try {
      res.json({
        payments: this.payments,
      });
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({
        message: "Server error fetching payments.",
        error: error.message,
      });
    }
  };

  createInvoice = async (customer_id) => {
    try {
      const invoice = await stripe.invoices.create({
        customer: customer_id,
        collection_method: "charge_automatically",
        auto_advance: true,
      });
      return invoice;
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  };

  // Step 2: Create an invoice item for the invoice obtained from the previous step, by passing the customer_id, invoice_id, and either price_id or amount and currency.
  createInvoiceItem = async (customer_id, invoice_id, amount, currency) => {
    try {
      const invoiceItem = await stripe.invoiceItems.create({
        customer: customer_id,
        amount: amount,
        currency: currency,
        invoice: invoice_id,
      });
      return invoiceItem;
    } catch (error) {
      console.error("Error creating invoice item:", error);
      throw error;
    }
  };

  // Step 3: Finalize the invoice to set its status to "open" and automatically receive the payment intent.
  finalizeInvoice = async (invoice_id) => {
    try {
      // console.log(stripe.invoices.search({ id: invoice_id }));
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(
        invoice_id
      );
      return finalizedInvoice;
    } catch (error) {
      console.error("Error finalizing invoice:", error);
      throw error;
    }
  };

  // Step 4: Request the payment intent for the invoice.
  getPaymentIntent = async (invoice_id) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        invoice: invoice_id,
      });
      return paymentIntent;
    } catch (error) {
      console.error("Error getting payment intent:", error);
      throw error;
    }
  };

  createCheckoutSession = async (req, res) => {
    try {
      const { amount, name, firstName, email } = req.body;

      const customer = await stripe.customers.create({
        name: firstName,
        email: email,
      });

      // await stripe.customers.update(customer.id, {
      //   invoice_settings: {
      //     default_payment_method: paymentMethodId,
      //   },
      // });

      const customer_id = customer.id;

      // Step 1: Create an invoice
      const invoice = await this.createInvoice(customer_id);
      // console.log("Created invoice:", invoice);

      // Step 2: Create an invoice item
      const invoiceItem = await this.createInvoiceItem(
        customer_id,
        invoice.id,
        amount,
        "eur"
      );
      console.log("Created invoice item:", invoiceItem);

      // Step 3: Finalize the invoice and get the payment intent
      const finalizedInvoice = await this.finalizeInvoice(invoice.id);
      console.log("Finalized invoice:", invoice.client_secret);

      // Step 4: Request the payment intent
      const paymentIntent = await stripe.paymentIntents.retrieve(
        finalizedInvoice.payment_intent
      );
      console.log("Payment intent:", paymentIntent.client_secret);

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error:", error);
    }
  };
}

export const Payment = new payment();
