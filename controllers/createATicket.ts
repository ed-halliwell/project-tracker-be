import { client } from "../src/server";
import type { Request, Response } from "express";
import { addATicketToBoard } from "../src/sqlQueries";

export const createATicket = async (req: Request, res: Response) => {
  const board_id = parseInt(req.params.board_id);
  const column_id = parseInt(req.params.column_id);
  let getBoardById;

  const { ticket_name, description, assigned_to, created_by, priority_order } =
    req.body;

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
      ticket_name: string,
      description: string,
      assigned_to: number,
      created_by: number,
      priority_order: number
    ): boolean => {
      return ticket_name &&
        description &&
        assigned_to &&
        created_by &&
        priority_order
        ? true
        : false;
    };
    if (
      checkReqBodyHasRequiredFields(
        ticket_name,
        description,
        assigned_to,
        created_by,
        priority_order
      )
    ) {
      try {
        const dbRes = await client.query(addATicketToBoard, [
          board_id,
          column_id,
          ticket_name,
          description,
          assigned_to,
          created_by,
          priority_order,
        ]);
        if (dbRes.rows.length > 0) {
          res.status(200).json({
            message: "Successfully added ticket to board",
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

      // end
    } else {
      res.status(400).json({
        message:
          "These fields are required: ticket_name, description, assigned_to, created_by, priority_order",
      });
    }
  } else {
    res.status(404).json({
      message: "Board not found",
    });
  }
};
