import { client } from "../src/server";
import type { Request, Response } from "express";
import { getAllColumnDataOnABoard } from "../src/sqlQueries";

export const getAllColumnDataForABoard = async (
  req: Request,
  res: Response
) => {
  const user_id = parseInt(req.params.user_id);
  const board_id = parseInt(req.params.board_id);
  let getBoardById;

  const getUserById = await client.query("SELECT * FROM users where id = $1", [
    user_id,
  ]);

  if (getUserById.rows.length > 0) {
    try {
      getBoardById = await client.query(
        "SELECT * FROM boards where created_by = $1 and id = $2",
        [user_id, board_id]
      );
    } catch (error) {
      console.error(error.message);
    }
    if (getBoardById.rows.length > 0) {
      try {
        const dbRes = await client.query(getAllColumnDataOnABoard, [board_id]);
        if (dbRes.rows.length > 0) {
          res.status(200).json({
            message: `Successfully retrieved column data for board Id: ${board_id}`,
            data: dbRes.rows,
          });
        } else {
          res.status(200).json({
            message: "No columns on this board",
          });
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      res.status(404).json({
        message: "Board not found",
      });
    }
  } else {
    res.status(404).json({
      message: "User not found",
    });
  }
};
