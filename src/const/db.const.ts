export class queries {
    public static DATABASE_NAME: string = `tbi-3`;
    public static DATABASE_VERSION: string = `1`;
    public static DATABASE_SIZE: number = 200;
    public static DATABASE_DESC: string = `Database for Tbi App`;
    public static CREATE_TABLE_PRODUCTS: string = `
    PRAGMA foreign_keys = off;
    BEGIN TRANSACTION;
    
    -- Table: projects
    DROP TABLE IF EXISTS projects;
    
    CREATE TABLE projects (
        id      STRING (16)  PRIMARY KEY
                             UNIQUE
                             NOT NULL,
        name    STRING (255) NOT NULL,
        [desc]  STRING (255),
        date    DATE         DEFAULT (getdate() ) 
                             NOT NULL,
        user    STRING (255),
        picture STRING,
        price   DECIMAL
    );
    
    
    COMMIT TRANSACTION;
    PRAGMA foreign_keys = on;`
}
