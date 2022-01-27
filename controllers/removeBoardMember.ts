import { client } from "../src/server";
import type { Request, Response } from "express";
import { removeABoardMember } from "../src/sqlQueries";

export const removeBoardMember = async (req: Request, res: Response) => {
  const board_id = parseInt(req.params.board_id);
  const user_id = parseInt(req.params.user_id);
  let checkBoardMemberExistsOnBoard;

  try {
    checkBoardMemberExistsOnBoard = await client.query(
      "SELECT * FROM board_members where board_id = $1 and user_id = $2",
      [board_id, user_id]
    );
  } catch (error) {
    console.error(error.message);
  }
  if (checkBoardMemberExistsOnBoard.rows.length > 0) {
    try {
      const dbRes = await client.query(removeABoardMember, [board_id, user_id]);
      if (dbRes.rows.length > 0) {
        res.status(200).json({
          message: "Successfully removed board member from board",
          data: dbRes.rows,
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
    res.status(404).json({
      message: "Board member not found on this board",
    });
  }
};
