import { SQLiteDatabaseConfig, SQLiteObject } from "@ionic-native/sqlite";

export class SQLiteMock {
    public create(config: SQLiteDatabaseConfig): Promise<SQLiteObject> {
  
      return new Promise((resolve, reject) => {
        resolve(new SQLiteObject(new Object()));
      });
    }
  } 