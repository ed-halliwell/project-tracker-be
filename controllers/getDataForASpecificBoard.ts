import { client } from "../src/server";
import type { Request, Response } from "express";
import { getBoardDataById } from "../src/sqlQueries";

export const getDataForASpecificBoard = async (req: Request, res: Response) => {
  const board_id = parseInt(req.params.board_id);

  try {
    const dbRes = await client.query(getBoardDataById, [board_id]);
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
  //   }
  //   else {
  //     res.status(404).json({
  //       message: "No board with this id found",
  //     });
  //   }
};
