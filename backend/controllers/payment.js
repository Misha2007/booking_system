import Stripe from "stripe";

import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.secretKey);

class payment {
  constructor() {
    this.payments = [];
  }

  // Handle the payment process
  createPaymentWithLineItems = async (req, res) => {
    try {
      const { customerEmail, amount, description } = req.body;

      // 1. Create the customer (optional, only if you want to save for future)
      const customer = await stripe.customers.create({
        email: customerEmail,
      });

      // 2. Create a PaymentIntent with metadata to simulate line items
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // in cents
        currency: "eur",
        customer: customer.id,
        description: description,
        metadata: {
          product_description: description,
          source: "manual-line-item",
          email: customerEmail,
        },
        receipt_email: customerEmail, // Auto-send receipt
      });

      // 3. Send client_secret to frontend
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

  // createCheckoutSession = async (req, res) => {
  //   try {
  //     // Create a Checkout session
  //     const session = await stripe.checkout.sessions.create({
  //       payment_method_types: ["card"], // Type of payment method, e.g., 'card'
  //       line_items: [
  //         {
  //           price_data: {
  //             currency: "usd", // Currency, e.g., 'usd'
  //             product_data: {
  //               name: "Product Name", // The name of the product you're selling
  //             },
  //             unit_amount: 1000, // Price in cents, e.g., $10.00
  //           },
  //           quantity: 1,
  //         },
  //       ],
  //       mode: "payment", // Indicates it's a one-time payment
  //       success_url: `http://ip:port/success`, // Success URL after payment
  //       cancel_url: `http://ip:port/cancel`, // Cancel URL if payment fails
  //     });

  //     // Return the sessionId to the frontend (clientSecret is not needed here)
  //     res.json({ sessionId: session.id });
  //   } catch (error) {
  //     console.error("Error creating checkout session:", error);
  //     res.status(500).json({ error: error.message });
  //   }
  // };

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
