export const getAllBoardData = `
select b.id as board_id, b.board_name, col.id as column_id, col.column_name, col.column_order, 
t.id as ticket_id,  t.ticket_name, t.description, t.assigned_to, 
u.user_name as assigned_to_user_name, t.created_by, t.created_at, t.priority_order from tickets as t 
inner join boards as b on t.board_id = b.id
inner join columns as col on t.column_id = col.id
inner join users as u on t.assigned_to = u.id
where b.created_by = $1
and t.board_id = $2`;
