import { client } from "../src/server";
import type { Request, Response } from "express";

export const getColumnMetaDataForABoard = async (
  req: Request,
  res: Response
) => {
  const board_id = parseInt(req.params.board_id);

  // check board exists
  const getBoardById = await client.query(
    "SELECT * FROM boards where id = $1",
    [board_id]
  );

  if (getBoardById.rows.length > 0) {
    try {
      const dbRes = await client.query(
        "SELECT id as column_id, column_order FROM columns WHERE board_id = $1",
        [board_id]
      );
      if (dbRes.rows.length > 0) {
        res.status(200).json({
          message: "Successfully retrieved metadata for columns",
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
      message: "No board with this id found",
    });
  }
};
