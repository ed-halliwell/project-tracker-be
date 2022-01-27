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
        // create 3 columns, get ids back
        let newBoardId = newBoard.rows[0].id;
        const createColumns = await client.query(createABoardInsertColumns, [
          newBoardId,
        ]);

        let firstColumn = createColumns.rows[0].id;
        let secondColumn = createColumns.rows[1].id;
        let thirdColumn = createColumns.rows[2].id;
        console.log(firstColumn, secondColumn, thirdColumn);
        console.log("just before ticket creation");
        // create 1 ticket in each column
        const createTickets = await client.query(createABoardInsertTickets, [
          newBoardId,
          firstColumn,
          secondColumn,
          thirdColumn,
          user_id,
        ]);

        console.log("just after ticket creation");
        console.log(createTickets.rows);
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