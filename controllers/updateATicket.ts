import { client } from "../src/server";
import type { Request, Response } from "express";
import {
  updateATicketNameDescription,
  updateATicketAssignedTo,
  updateATicketColumn,
  updateATicketPriority,
} from "../src/sqlQueries";

export const updateATicket = async (req: Request, res: Response) => {
  const board_id = parseInt(req.params.board_id);

  const { ticket_name, description, assigned_to, priority_order, column_id } =
    req.body;

  // check the board exists
  const getBoardById = await client.query(
    "SELECT * FROM boards where id = $1",
    [board_id]
  );
  if (getBoardById.rows.length > 0) {
    // check the ticket exists
    const ticket_id = parseInt(req.params.ticket_id);
    const getTicketByBoardId = await client.query(
      "SELECT * FROM tickets where board_id = $1 and id = $2",
      [board_id, ticket_id]
    );
    if (getTicketByBoardId.rows.length > 0) {
      // change ticket name and/or description
      if (ticket_name && description) {
        try {
          const updateNameAndDescription = await client.query(
            updateATicketNameDescription,
            [board_id, ticket_id, ticket_name, description]
          );
          if (updateNameAndDescription.rows.length > 0) {
            res.status(200).json({
              message:
                "Successfully updated this ticket's name and/or description",
              data: updateNameAndDescription.rows,
            });
          } else {
            res.status(500).json({
              message: "Something went wrong",
            });
          }
        } catch (error) {
          console.error(error.message);
        }
      }

      // change assigned to
      if (assigned_to) {
        try {
          const updateAssignedTo = await client.query(updateATicketAssignedTo, [
            board_id,
            ticket_id,
            assigned_to,
          ]);
          if (updateAssignedTo.rows.length > 0) {
            res.status(200).json({
              message: "Successfully updated this ticket's assigned to value",
              data: updateAssignedTo.rows,
            });
          } else {
            res.status(500).json({
              message: "Something went wrong",
            });
          }
        } catch (error) {
          console.error(error.message);
        }
      }
      // change priority order
      if (priority_order) {
        try {
          const updatePriority = await client.query(updateATicketPriority, [
            board_id,
            ticket_id,
            priority_order,
          ]);
          if (updatePriority.rows.length > 0) {
            res.status(200).json({
              message: "Successfully updated this ticket's priority",
              data: updatePriority.rows,
            });
          } else {
            res.status(500).json({
              message: "Something went wrong",
            });
          }
        } catch (error) {
          console.error(error.message);
        }
      }
      // change column
      if (column_id) {
        try {
          const updateColumn = await client.query(updateATicketColumn, [
            board_id,
            ticket_id,
            column_id,
          ]);
          if (updateColumn.rows.length > 0) {
            res.status(200).json({
              message: "Successfully updated this ticket's column",
              data: updateColumn.rows,
            });
          } else {
            res.status(500).json({
              message: "Something went wrong",
            });
          }
        } catch (error) {
          console.error(error.message);
        }
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
