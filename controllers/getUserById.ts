import { client } from "../src/server";
import type { Request, Response } from "express";

export const getUserById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const dbRes = await client.query("SELECT * FROM users where id = $1", [id]);
    if (dbRes.rows) {
      res.status(200).json({
        message: `Successfully retrieved data for user Id: ${id}`,
        data: dbRes.rows,
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    console.error(error.message);
  }
};
