import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { ITicket } from "./interfaces";

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
import { getUserById } from "../controllers/getUserById";
import { getBoardsForUser } from "../controllers/getBoardsForUser";
import { getAllBoardDataForUserById } from "../controllers/getAllBoardDataForUserById";
import { getAllColumnDataForABoard } from "../controllers/getColumnDataByIdForABoard";
import { createATicket } from "../controllers/createATicket";
import { deleteATicket } from "../controllers/deleteATicket";
import { updateATicket } from "../controllers/updateATicket";
import { getDataByBoardId } from "../controllers/getDataByBoardId";

app.get("/users", getUsers);
app.get("/users/:user_id", getUserById);
app.get("/users/:user_id/boards", getBoardsForUser);
app.get("/boards/:board_id/tickets", getDataByBoardId);
app.get("/users/:user_id/boards/:board_id/tickets", getAllBoardDataForUserById);
app.get("/users/:user_id/boards/:board_id/columns", getAllColumnDataForABoard);

app.patch<{ id: string }, Partial<ITicket>>(
  "/users/:user_id/boards/:board_id/tickets/:ticket_id",
  updateATicket
);

app.post(
  "/users/:user_id/boards/:board_id/columns/:column_id/tickets",
  createATicket
);

app.delete(
  "/users/:user_id/boards/:board_id/tickets/:ticket_id",
  deleteATicket
);

//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw "Missing PORT environment variable.  Set it in .env file.";
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
