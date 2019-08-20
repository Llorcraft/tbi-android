export const create_table_contacts = `CREATE TABLE IF NOT EXISTS "contacts" (
	"name"	TEXT NOT NULL,
	"email"	TEXT,
	"phone"	TEXT,
	"type"	INTEGER NOT NULL,
	"project_id"	INTEGER NOT NULL
)`