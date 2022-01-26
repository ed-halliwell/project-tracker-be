import { client } from "../src/server";
import type { Request, Response } from "express";
import { updateATicketColumn } from "../src/sqlQueries";

export const updateColumnForATicket = async (req: Request, res: Response) => {
  const board_id = parseInt(req.params.board_id);
  const ticket_id = parseInt(req.params.board_id);
  const { type } = req.body;

  if (ticket_id && type) {
    // check the board exists
    const getBoardById = await client.query(
      "SELECT * FROM boards where id = $1",
      [board_id]
    );
    if (getBoardById.rows.length > 0) {
      // check the ticket exists on the board
      const ticket_id = parseInt(req.params.ticket_id);
      const getTicketByBoardId = await client.query(
        "SELECT * FROM tickets where board_id = $1 and id = $2",
        [board_id, ticket_id]
      );

      if (getTicketByBoardId.rows.length > 0) {
        const columnIds = await client.query(
          "select id from columns as col where col.board_id = $1",
          [board_id]
        );

        let nextColumnUp;
        let nextColumnDown;
        const currentColumnId = getTicketByBoardId.rows[0].column_id;
        let newPriorityValue;
        let newColumnValue;

        if (type === "forward") {
          if (columnIds) {
            for (const column of columnIds.rows) {
              if (column.id > currentColumnId) {
                if (nextColumnUp === undefined) {
                  nextColumnUp = column.id;
                } else if (column.id < nextColumnUp) {
                  nextColumnUp = column.id;
                }
              }
            }
            const getMaxPriorityInNewColumn = await client.query(
              "select max(priority_order) from tickets where column_id = $1",
              [nextColumnUp]
            );
            newPriorityValue = getMaxPriorityInNewColumn.rows[0].max + 1;
            newColumnValue = nextColumnUp;
          }
        } else if (type === "back") {
          if (columnIds) {
            for (const column of columnIds.rows) {
              if (column.id < currentColumnId) {
                if (nextColumnDown === undefined) {
                  nextColumnDown = column.id;
                } else if (column.id > nextColumnDown) {
                  nextColumnDown = column.id;
                }
              }
            }
          }
          const getMaxPriorityInNewColumn = await client.query(
            "select max(priority_order) from tickets where column_id = $1",
            [nextColumnDown]
          );
          newPriorityValue = getMaxPriorityInNewColumn.rows[0].max + 1;
          newColumnValue = nextColumnDown;
        }

        if (
          (type === "forward" && nextColumnUp !== undefined) ||
          (type === "back" && nextColumnDown !== undefined)
        ) {
          try {
            const updateColumn = await client.query(updateATicketColumn, [
              board_id,
              ticket_id,
              newColumnValue,
              newPriorityValue,
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
        } else {
          res.status(400).json({
            message: "Can't update this ticket's column value",
          });
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
  } else {
    res.status(400).json({
      message: "Type is required",
    });
  }
};
