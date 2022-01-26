import { client } from "../src/server";
import type { Request, Response } from "express";
import {
  getTicketDataByColumnIdOnABoard,
  getColumnMetaData,
} from "../src/sqlQueries";

export const getColumnDataByIdForABoard = async (
  req: Request,
  res: Response
) => {
  const board_id = parseInt(req.params.board_id);
  const column_id = parseInt(req.params.column_id);

  // check board exists
  const getBoardById = await client.query(
    "SELECT * FROM boards where id = $1",
    [board_id]
  );

  if (getBoardById.rows.length > 0) {
    // check column exists on board
    const checkColumnExists = await client.query(
      "SELECT * FROM columns where board_id = $1 and id = $2",
      [board_id, column_id]
    );
    if (checkColumnExists) {
      try {
        const ticketInfo = await client.query(getTicketDataByColumnIdOnABoard, [
          board_id,
          column_id,
        ]);
        const boardColumnInfo = await client.query(getColumnMetaData, [
          board_id,
          column_id,
        ]);

        if (ticketInfo.rows.length > 0) {
          res.status(200).json({
            message: "Successfully retrieved data for column",
            columnData: boardColumnInfo.rows,
            ticketData: ticketInfo.rows,
          });
        } else if (ticketInfo.rows.length === 0) {
          res.status(404).json({
            message: "No column found",
            columnData: boardColumnInfo.rows,
            ticketData: ticketInfo.rows,
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
        message: "No column with this id found",
      });
    }
  } else {
    res.status(404).json({
      message: "No board with this id found",
    });
  }
};
