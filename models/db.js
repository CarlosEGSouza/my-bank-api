import mongoose from "mongoose";
import accountModel from "./accountModel.js";
import dotenv from "dotenv";

dotenv.config();

const db = {};

db.url = process.env.MONGO_URL;
db.mongoose = mongoose;
db.account = accountModel(mongoose);

export { db };
