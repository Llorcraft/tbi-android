import { create_table_contacts } from "./create_table_contacts";
import { create_table_projects } from "./create_table_projects";

export const db_scripts = {
    create_table: {
        projects: create_table_projects,
        contacts: create_table_contacts
    }
}