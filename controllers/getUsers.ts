import { client } from "../src/server";
import type { Request, Response } from "express";

export const getUsers = async (_: Request, res: Response) => {
  try {
    const dbRes = await client.query(
      "SELECT * FROM users order by user_name asc"
    );
    if (dbRes.rows) {
      res.status(200).json({
        message: "Successfully retrieved all users",
        data: dbRes.rows,
      });
    } else {
      res.status(500).json({
        message: "Could not fetch any users",
      });
    }
  } catch (error) {
    console.error(error.message);
  }
};
