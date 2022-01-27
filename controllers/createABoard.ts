import { client } from "../src/server";
import type { Request, Response } from "express";
import {
  createABoardInsertColumns,
  createABoardInsertTickets,
} from "../src/sqlQueries";

export const createABoard = async (req: Request, res: Response) => {
  const { user_id, board_name } = req.body;
  let checkUserIsValid;
  try {
    checkUserIsValid = await client.query("SELECT * FROM users where id = $1", [
      user_id,
    ]);
  } catch (error) {
    console.error(error.message);
  }
  if (checkUserIsValid.rows.length > 0) {
    // check that all the required fields are present
    const checkReqBodyHasRequiredFields = (
      boardName: string,
      userId: number
    ): boolean => {
      return boardName && userId ? true : false;
    };
    if (checkReqBodyHasRequiredFields(board_name, user_id)) {
      try {
        // create board, get id back
        const newBoard = await client.query(
          "INSERT INTO boards (board_name, created_by) VALUES ($1, $2) RETURNING id",
          [board_name, user_id]
        );
        const newBoardId = newBoard.rows[0].id;

        // add creating user as Owner in board members table
        const setOwner = await client.query(
          "INSERT INTO board_members (board_id, user_id, member_role) VALUES ($1, $2, 'Owner') RETURNING *",
          [newBoardId, user_id]
        );

        // create 3 columns, get ids back
        const createColumns = await client.query(createABoardInsertColumns, [
          newBoardId,
        ]);

        const firstColumn = createColumns.rows[0].id;
        const secondColumn = createColumns.rows[1].id;
        const thirdColumn = createColumns.rows[2].id;

        // create 1 ticket in each column
        const createTickets = await client.query(createABoardInsertTickets, [
          newBoardId,
          firstColumn,
          secondColumn,
          thirdColumn,
          user_id,
        ]);

        if (createTickets.rows.length > 0) {
          res.status(200).json({
            message: "Successfully created board",
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
  } else {
    res.status(404).json({
      message: "User not found",
    });
  }
};
