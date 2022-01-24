export interface ITicket {
  id: number;
  board_id: number;
  column_id: number;
  ticket_name: string;
  description: string;
  assigned_to: number;
  created_by: number;
  priority_order: number;
}
