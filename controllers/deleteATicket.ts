import { client } from "../src/server";
import type { Request, Response } from "express";
import { removeATicketFromBoard } from "../src/sqlQueries";

export const deleteATicket = async (req: Request, res: Response) => {
  const board_id = parseInt(req.params.board_id);
  const ticket_id = parseInt(req.params.ticket_id);

  // check the board exists
  const getBoardById = await client.query(
    "SELECT * FROM boards where id = $1",
    [board_id]
  );
  if (getBoardById) {
    // check the ticket exists

    const getTicketByBoardId = await client.query(
      "SELECT * FROM tickets where board_id = $1 and id = $2",
      [board_id, ticket_id]
    );
    if (getTicketByBoardId) {
      try {
        const dbRes = await client.query(removeATicketFromBoard, [
          board_id,
          ticket_id,
        ]);
        if (dbRes.rowCount !== 0) {
          res.status(200).json({
            message: `Ticket successfully deleted on board id: ${board_id}`,
            data: dbRes.rows[0],
          });
        } else {
          res.status(500).json({
            message: `Something went wrong with deleting this ticket`,
          });
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      res.status(404).json({
        message: "Ticket not found",
      });
    }
  } else {
    res.status(404).json({
      message: "Board not found",
    });
  }
};
