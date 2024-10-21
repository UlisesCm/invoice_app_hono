import { HttpBindings, serve } from "@hono/node-server";
import { Hono } from "hono";
import connectDB from "./db";
import { Invoice } from "./models";
import { cors } from "hono/cors";
import { v2 as cloudinary } from "cloudinary";
import { encodeBase64 } from "hono/utils/encode";

connectDB();
const app = new Hono<{ Bindings: HttpBindings }>();
app.use(async (_c, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return await next();
});
app.use("/*", cors());
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// Create a new invoice
app.post("/invoices", async (c) => {
  try {
    const invoiceData = await c.req.json();
    const newInvoice = new Invoice(invoiceData);
    const validationResult = newInvoice.validateSync();
    if (validationResult) {
      throw validationResult;
    }
    await newInvoice.save();
    return c.json({ message: "Invoice created", invoice: newInvoice });
  } catch (error) {
    console.log("err", error);
    return c.json({ message: "Error creating invoice" }, 500);
  }
});

// Get all invoices
app.get("/invoices", async (c) => {
  const invoices = await Invoice.find();
  return c.json(invoices);
});

// Get a single invoice by ID
app.get("/invoices/:id", async (c) => {
  const invoice = await Invoice.findById(c.req.param("id"));
  if (!invoice) {
    return c.json({ message: "Invoice not found" }, 404);
  }
  return c.json(invoice);
});

// Update an invoice by ID
app.put("/invoices/:id", async (c) => {
  const invoiceData = await c.req.json();
  const updatedInvoice = await Invoice.findByIdAndUpdate(
    c.req.param("id"),
    invoiceData,
    { new: true },
  );
  if (!updatedInvoice) {
    return c.json({ message: "Invoice not found" }, 404);
  }
  return c.json(updatedInvoice);
});

// Delete an invoice by ID
app.delete("/invoices/:id", async (c) => {
  const deletedInvoice = await Invoice.findByIdAndDelete(c.req.param("id"));
  if (!deletedInvoice) {
    return c.json({ message: "Invoice not found" }, 404);
  }
  return c.json({ message: "Invoice deleted" });
});

app.post("/upload", async (c) => {
  try {
    const body = await c.req.parseBody();
    const image = body["image"] as File;
    const byteArrayBuffer = await image?.arrayBuffer();
    const base64 = encodeBase64(byteArrayBuffer);
    const result = await cloudinary?.uploader?.upload(
      `data:image/png;base64,${base64}`,
    );
    return c.json(result);
  } catch (error) {
    console.log("err", error);
    return c.json({ message: "Error uploading image" }, 500);
  }
});

const port = 3001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
