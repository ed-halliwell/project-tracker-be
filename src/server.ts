import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

const app = express();

config();
app.use(express.json());
app.use(cors());

const herokuSSLSetting = { rejectUnauthorized: false };
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting;
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

export const client = new Client(dbConfig);

async function clientConnect() {
  await client.connect();
  console.log("Client connected successfully");
}

clientConnect();

import { getUsers } from "../controllers/getUsers";

app.get("/resources", getUsers);

//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw "Missing PORT environment variable.  Set it in .env file.";
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
