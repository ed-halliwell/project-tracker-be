import { client } from "../src/server";
import type { Request, Response } from "express";

export const getBoardsForUser = async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.user_id);
  const getUserById = await client.query("SELECT * FROM users where id = $1", [
    user_id,
  ]);
  if (getUserById.rows.length > 0) {
    try {
      const dbRes = await client.query(
        "SELECT * FROM boards WHERE created_by = $1",
        [user_id]
      );
      if (dbRes.rows.length > 0) {
        res.status(200).json({
          message: `Successfully retrieved boards for user Id: ${user_id}`,
          data: dbRes.rows,
        });
      } else {
        res.status(200).json({
          message: "No boards found",
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  } else {
    res.status(404).json({
      message: "User not found",
    });
  }
};
