import { QueryInterface, Sequelize } from "sequelize"
import {RegisterResult} from "../api-models"
import { Umzug } from "umzug"
import path from "path"
import { buildMigrator } from "../utils/tools-database"
import * as usersDB from "./users-db"

//Users responsible class, all code that modifes users must be found here
export class UsersModule {
    private readonly migrator: Umzug<QueryInterface>

    constructor(private readonly database: Sequelize) {
        const migrationsPath: string = path.join(__dirname, "migrations").replace(/\\/g, "/")
        this.migrator = buildMigrator(database, migrationsPath)
    }

    static async loadModule(database: Sequelize): Promise<UsersModule> {
        const service = new UsersModule( database)
        await service.loadDatabaseModels()
        return service
    }

    async loadDatabaseModels(): Promise<void> {
        usersDB.configureSequelizeModel(this.database)
        await this.migrator.up()
    }

    async createUser(username: string): Promise<RegisterResult> {
        try {
            const existingUser = await usersDB.User.findOne({ where: { username } })
            if (existingUser) return { status: "username already exists" }
            const newUser = await usersDB.User.create({ username })
            return { status: "ok", userId: newUser.userId }
        } catch (error) {
            console.error("Error creating user:", error)
            return { status: "cannot connect to database" }
        }
    }
}
