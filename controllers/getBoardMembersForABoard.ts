import { client } from "../src/server";
import type { Request, Response } from "express";
import { getAllBoardMemberData } from "../src/sqlQueries";

export const getBoardMembersForABoard = async (req: Request, res: Response) => {
  const board_id = parseInt(req.params.board_id);

  const getBoardById = await client.query(
    "SELECT * FROM boards where id = $1",
    [board_id]
  );

  if (getBoardById.rows.length > 0) {
    try {
      const dbRes = await client.query(getAllBoardMemberData, [board_id]);
      if (dbRes.rows.length > 0) {
        res.status(200).json({
          message: `Successfully retrieved board member data for Board Id: ${board_id}`,
          data: dbRes.rows,
        });
      } else {
        res.status(200).json({
          message: "No board members found",
          data: [],
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
};
