import mongoose, { Schema, Document } from "mongoose";

export interface ICompany extends Document {
  companyName: string;
  firstName: string;
  lastName: string;
  companyWebsite: string;
  companyAddress: string;
  cityStateZip: string;
  country: string;
  phoneNo: string;
  email: string;
  imageUrl?: string;
}

export interface IClient extends Document {
  clientCompany: string;
  clientFirstName: string;
  clientLastName: string;
  clientAddress: string;
  clientCityStateZip: string;
  clientCountry: string;
  clientEmail: string;
}

export interface IItem extends Document {
  itemId: number;
  description: string;
  quantity: number | string;
  price: number | string;
}

export interface IInvoice extends Document {
  company: ICompany;
  client: IClient;
  no: string;
  date: string;
  dueDate: string;
  subtotal: number | string;
  tax: number | string;
  discount: number | string;
  total: number | string;
  table: IItem[];
  notes: string;
}

const CompanySchema: Schema = new Schema({
  companyName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  companyWebsite: { type: String, required: true },
  companyAddress: { type: String, required: true },
  cityStateZip: { type: String, required: true },
  country: { type: String, required: true },
  phoneNo: { type: String, required: true },
  email: { type: String, required: true },
  imageUrl: { type: String },
});

const ClientSchema: Schema = new Schema({
  clientCompany: { type: String, required: true },
  clientFirstName: { type: String, required: true },
  clientLastName: { type: String, required: true },
  clientAddress: { type: String, required: true },
  clientCityStateZip: { type: String, required: true },
  clientCountry: { type: String, required: true },
  clientEmail: { type: String, required: true },
});

const ItemSchema: Schema = new Schema({
  itemId: { type: Number, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const InvoiceSchema: Schema = new Schema({
  company: { type: CompanySchema, required: true },
  client: { type: ClientSchema, required: true },
  no: { type: String, required: true },
  date: { type: String, required: true },
  dueDate: { type: String, required: true },
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  discount: { type: Number, required: true },
  total: { type: Number, required: true },
  notes: { type: String, required: true },
  table: { type: [ItemSchema], required: true },
});

export const Company = mongoose.model<ICompany>("Company", CompanySchema);
export const Client = mongoose.model<IClient>("Client", ClientSchema);
export const Item = mongoose.model<IItem>("Item", ItemSchema);
export const Invoice = mongoose.model<IInvoice>("Invoice", InvoiceSchema);
