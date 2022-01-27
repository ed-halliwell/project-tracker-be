import { client } from "../src/server";
import type { Request, Response } from "express";
import { addABoardMember } from "../src/sqlQueries";

export const addBoardMember = async (req: Request, res: Response) => {
  const board_id = parseInt(req.params.board_id);
  let getBoardById;

  const { user_id, member_role } = req.body;

  try {
    getBoardById = await client.query("SELECT * FROM boards where id = $1", [
      board_id,
    ]);
  } catch (error) {
    console.error(error.message);
  }
  if (getBoardById.rows.length > 0) {
    // check that all the required fields are present
    const checkReqBodyHasRequiredFields = (
      userId: number,
      memberRole: string
    ): boolean => {
      return userId && memberRole ? true : false;
    };
    if (checkReqBodyHasRequiredFields(user_id, member_role)) {
      try {
        const dbRes = await client.query(addABoardMember, [
          board_id,
          user_id,
          member_role,
        ]);
        if (dbRes.rows.length > 0) {
          res.status(200).json({
            message: "Successfully added board member to board",
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
      res.status(400).json({
        message: "These fields are required: user_id, member_role",
      });
    }
  } else {
    res.status(404).json({
      message: "Board not found",
    });
  }
};
