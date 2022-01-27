import { client } from "../src/server";
import type { Request, Response } from "express";

export const deleteABoard = async (req: Request, res: Response) => {
  const board_id = parseInt(req.params.board_id);

  let checkBoardExists;
  try {
    checkBoardExists = await client.query(
      "SELECT * FROM boards where id = $1",
      [board_id]
    );
  } catch (error) {
    console.error(error.message);
  }
  if (checkBoardExists.rows.length > 0) {
    try {
      const deleteTickets = await client.query(
        "DELETE FROM tickets where board_id = $1 RETURNING *",
        [board_id]
      );
      console.log(deleteTickets.rows);
      const deleteBoardMembers = await client.query(
        "DELETE FROM board_members where board_id = $1 RETURNING *",
        [board_id]
      );
      console.log(deleteBoardMembers.rows);
      const deleteColumns = await client.query(
        "DELETE FROM columns where board_id = $1 RETURNING *",
        [board_id]
      );
      console.log(deleteColumns.rows);
      const deleteBoard = await client.query(
        "DELETE FROM boards where id = $1 RETURNING *",
        [board_id]
      );
      console.log(deleteBoard.rows);

      if (deleteBoard.rows.length > 0) {
        res.status(200).json({
          message: "Successfully deleted board",
        });
      } else {
        res.status(500).json({
          message: "Something went wrong",
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  } else {
    res.status(400).json({
      message: "These fields are required: board_name",
    });
  }
};
