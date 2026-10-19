USE podium_manager;

ALTER TABLE users
  MODIFY COLUMN role ENUM('admin', 'receptionist', 'caissier', 'coach') NOT NULL DEFAULT 'receptionist';
