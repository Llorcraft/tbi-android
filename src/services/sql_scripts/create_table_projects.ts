export const create_table_projects = `CREATE TABLE "projects" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"name"	TEXT NOT NULL,
	"desc"	TEXT,
	"date"	TEXT NOT NULL,
	"price"	NUMERIC,
	"price_delta"	NUMERIC DEFAULT 1,
	"co2"	NUMERIC,
	"currency"	TEXT NOT NULL,
	"currency_index"	INTEGER NOT NULL DEFAULT 1,
	"co2_index"	INTEGER DEFAULT 0,
	"picture_id"	INTEGER
)`