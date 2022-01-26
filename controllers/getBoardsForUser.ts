import { client } from "../src/server";
import type { Request, Response } from "express";
import {
  getBoardDataForAUser,
  getBoardSharedWithAUser,
} from "../src/sqlQueries";

export const getBoardsForUser = async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.user_id);
  const getUserById = await client.query("SELECT * FROM users where id = $1", [
    user_id,
  ]);
  if (getUserById.rows.length > 0) {
    try {
      const userIsOwner = await client.query(getBoardDataForAUser, [user_id]);
      const userIsShared = await client.query(getBoardSharedWithAUser, [
        user_id,
      ]);
      if (userIsOwner.rows.length > 0 || userIsShared.rows.length > 0) {
        res.status(200).json({
          message: `Successfully retrieved boards for user Id: ${user_id}`,
          ownedBoards: userIsOwner.rows,
          sharedBoards: userIsShared.rows,
        });
      } else {
        res.status(200).json({
          message: "No boards found",
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  } else {
    res.status(404).json({
      message: "User not found",
    });
  }
};
