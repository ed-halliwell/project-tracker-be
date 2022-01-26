export const getBoardDataForAUser = `
SELECT b.id, b.board_name, b.created_by, u.user_name, b.created_at FROM boards as b
inner join users as u on b.created_by = u.id
WHERE created_by = $1
`;

export const getBoardSharedWithAUser = `
SELECT b.id, b.board_name, b.created_by, u.user_name, b.created_at, shared.member_role FROM boards as b
inner join users as u on b.created_by = u.id
inner JOIN (select board_id, member_role from board_members
where user_id = $1
and member_role != 'Owner') as shared on b.id = shared.board_id
`;

export const getAllBoardData = `
select b.id as board_id, b.board_name, col.id as column_id, col.column_name, col.column_order, 
t.id as ticket_id,  t.ticket_name, t.description, t.assigned_to, 
u.user_name as assigned_to_user_name, t.created_by, t.created_at, t.priority_order from tickets as t 
inner join boards as b on t.board_id = b.id
inner join columns as col on t.column_id = col.id
inner join users as u on t.assigned_to = u.id
where b.created_by = $1
and t.board_id = $2`;

export const getAllBoardDataById = `
select b.id as board_id, b.board_name, col.id as column_id, col.column_name, col.column_order, 
t.id as ticket_id,  t.ticket_name, t.description, t.assigned_to, 
u.user_name as assigned_to_user_name, t.created_by, t.created_at, t.priority_order from tickets as t 
inner join boards as b on t.board_id = b.id
inner join columns as col on t.column_id = col.id
inner join users as u on t.assigned_to = u.id
where t.board_id = $1
`;

export const getBoardDataById = `
SELECT b.id, b.board_name, b.created_by, u.user_name, b.created_at FROM boards as b 
inner join users as u on b.created_by = u.id
WHERE b.id = $1
`;

export const getColumnMetaData = `
select b.id as board_id, b.board_name, col.id as column_id, col.column_name, col.column_order
from columns as col
inner join boards as b on b.id = col.board_id
where b.id = $1
and col.id = $2
`;

export const getTicketDataByColumnIdOnABoard = `
select t.id as ticket_id,  t.ticket_name, t.description, t.assigned_to,
u.user_name as assigned_to_user_name, t.created_by, u2.user_name, t.created_at, t.priority_order from tickets as t
inner join columns as col on t.column_id = col.id
inner join users as u on t.assigned_to = u.id
inner join users as u2 on t.created_by = u2.id
where t.board_id = $1
and col.id = $2
order by t.priority_order desc
`;

export const getAllColumnDataOnABoard = `
select * from columns as col
where col.board_id = $1`;

export const addATicketToBoard = `
INSERT INTO tickets (
    board_id, column_id, ticket_name, description, assigned_to, created_at, created_by, priority_order
) VALUES 
($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, $7) RETURNING *
`;

export const removeATicketFromBoard = `
DELETE FROM tickets 
WHERE board_id = $1
AND id = $2
RETURNING *
`;

export const updateATicketNameDescription = `
UPDATE tickets SET ticket_name = $3, description = $4 WHERE board_id = $1 and id = $2 RETURNING *
`;

export const updateATicketAssignedTo = `
UPDATE tickets SET assigned_to = $3 WHERE board_id = $1 and id = $2 RETURNING *
`;

export const updateATicketColumn = `
UPDATE tickets SET column_id = $3 WHERE board_id = $1 and id = $2 RETURNING *
`;

export const updateATicketPriority = `
UPDATE tickets SET priority_order = $3 WHERE board_id = $1 and id = $2 RETURNING *
`;

export const getAllBoardMemberData = `
select bm.user_id, u.user_name, bm.member_role, bm.date_added from board_members as bm
inner join users as u on bm.user_id = u.id
where bm.board_id = $1
order by user_id asc
`;
