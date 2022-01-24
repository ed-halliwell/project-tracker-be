CREATE TABLE users ( 
  id SERIAL PRIMARY KEY, 
  user_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  profile_image text,
  is_admin BOOLEAN NOT NULL
)

INSERT INTO users (
    user_name, email, created_at, profile_image, is_admin
) VALUES 
('Bill Gates', 'bill@fakeemail.com', CURRENT_TIMESTAMP, null, true),
('Larry Page', 'larry@fakeemail.com', CURRENT_TIMESTAMP, null, false)


CREATE TABLE boards ( 
  id SERIAL PRIMARY KEY, 
  board_name VARCHAR(255) NOT NULL,
  created_by int NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (created_by) references users(id) 
)

INSERT INTO boards (
    board_name, created_by
) VALUES 
('Kanban Board', 1),
('Project Board', 1)

CREATE TYPE member_role AS ENUM 
(
  'Admin', 
  'Team Member',
  'Viewer'
);

CREATE TABLE board_members (
  board_id INT NOT NULL,
  user_id INT NOT NULL,
  member_role member_role NOT NULL,
  date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (board_id) references boards(id),
  FOREIGN KEY (user_id) references users(id) 
)

INSERT INTO board_members (
    board_id, user_id, member_role, date_added
) VALUES 
(1, 2, 'Team Member', CURRENT_TIMESTAMP)
(1, 2, 'Team Member', CURRENT_TIMESTAMP)

CREATE TYPE member_role AS ENUM 
(
  'Admin', 
  'Team Member',
  'Viewer'
);

CREATE TABLE columns ( 
  id SERIAL PRIMARY KEY, 
  board_id INT NOT NULL,
  column_name VARCHAR(255) NOT NULL,
  column_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (board_id) references boards(id)
)

INSERT INTO columns (
    board_id, column_name, column_order, created_at
) VALUES 
(1, 'To do', 1, CURRENT_TIMESTAMP),
(1, 'In Progress', 2, CURRENT_TIMESTAMP),
(1, 'Done', 2, CURRENT_TIMESTAMP)

CREATE TABLE tickets ( 
  id SERIAL PRIMARY KEY, 
  board_id INT NOT NULL,
  column_id INT NOT NULL,
  ticket_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  assigned_to INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  created_by INT NOT NULL,
  priority_order INT NOT NULL,
  FOREIGN KEY (board_id) references boards(id),
  FOREIGN KEY (column_id) references columns(id),
  FOREIGN KEY (created_by) references users(id),
  FOREIGN KEY (assigned_to) references users(id) 
)

INSERT INTO tickets (
    board_id, column_id, ticket_name, description, assigned_to, created_at, created_by, priority_order
) VALUES 
(1, 1, 'First ticket', 'A great description...', 1, CURRENT_TIMESTAMP, 1, 1),
(1, 2, 'Second ticket', 'A great description...', 1, CURRENT_TIMESTAMP, 1, 1),
(1, 2, 'Third ticket', 'A great description...', 1, CURRENT_TIMESTAMP, 1, 2),
(1, 3, 'Fourth ticket', 'A great description...', 1, CURRENT_TIMESTAMP, 1, 1)



